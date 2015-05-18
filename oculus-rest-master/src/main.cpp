#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#ifdef _WIN32
    #include <winsock2.h>
    #include <BaseTsd.h>
    #include <WS2tcpip.h>
    #include <sys/types.h>
    typedef unsigned long ssize_t;
    #define MHD_PLATFORM_H
#endif
#include <microhttpd.h>
#include <OVR.h>

ovrHmd Hmd;
bool UsingDebugHmd;

using namespace OVR;

static int ahc_echo(void * cls, struct MHD_Connection * connection, const char * url, const char * method, const char * version, const char * upload_data, size_t * upload_data_size, void ** ptr) {
	static int dummy;
	// const char * page = (const char *)cls;
	struct MHD_Response * response;
	int ret;

	if (0 != strcmp(method, "GET"))
		return MHD_NO; /* unexpected method */
	if (&dummy != *ptr) {
		/* The first time only the headers are valid,
		do not respond in the first round... */
		*ptr = &dummy;
		return MHD_YES;
	}
	if (0 != *upload_data_size)
		return MHD_NO; /* upload data in a GET!? */
	*ptr = NULL; /* clear context pointer */

	ovrHmd_BeginFrameTiming(Hmd, 0);
	ovrPosef pose = ovrHmd_GetHmdPosePerEye(Hmd, ovrEye_Right);
	ovrQuatf orientation = pose.Orientation;
	ovrVector3f position = pose.Position;
	Quatf o = orientation;
	float yaw, pitch, roll;
	o.GetEulerAngles<OVR::Axis_Y, OVR::Axis_X, OVR::Axis_Z>(&yaw, &pitch, &roll);
	
	char json[1000] = { 0, };
	sprintf(json, "{" );
	sprintf(json+strlen(json), "\"quat\":{\"x\":%1.7f,\"y\":%1.7f,\"z\":%1.7f,\"w\":%1.7f}", orientation.x, orientation.y, orientation.z, orientation.w );
	sprintf(json+strlen(json), "," );
	sprintf(json+strlen(json), "\"euler\":{\"y\":%1.7f,\"p\":%1.7f,\"r\":%1.7f}", yaw, pitch, roll );
	sprintf(json+strlen(json), "," );
	sprintf(json+strlen(json), "\"position\":{\"x\":%1.7f,\"y\":%1.7f,\"z\":%1.7f}", position.x, position.y, position.z );
	sprintf(json+strlen(json), "}" );
	
    ovrHmd_EndFrameTiming(Hmd);
	response = MHD_create_response_from_data(strlen(json), (void*) &json, MHD_NO, MHD_YES);
	MHD_add_response_header (response, "Content-Type", "application/json");
	MHD_add_response_header (response, "Access-Control-Allow-Origin", "*");
	ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
	MHD_destroy_response(response);
	return ret;
}

int main(int argc, char **argv) {	

	ovr_Initialize();
    Hmd = ovrHmd_Create(0);
    if (!Hmd)
	{
		// If we didn't detect an Hmd, create a simulated one for debugging.
        printf("Using a dummy Hmd\n");
		Hmd = ovrHmd_CreateDebug(ovrHmd_DK1);
		UsingDebugHmd = true;
		if (!Hmd)
		{   // Failed Hmd creation.
            printf("couldn't even make a fake guy :(.");
			return 1;
		}
	}
    
    // Start the sensor which provides the Rift’s pose and motion.
    ovrHmd_ConfigureTracking(Hmd, ovrTrackingCap_Orientation |
                             ovrTrackingCap_MagYawCorrection |
                             ovrTrackingCap_Position, 0);
    
	struct MHD_Daemon * d;
	d = MHD_start_daemon(MHD_USE_THREAD_PER_CONNECTION, 50000, NULL, NULL, &ahc_echo, NULL, MHD_OPTION_END);
	if (d == NULL) {
		printf("Unable to start webserver.\n");
		return 1;
	}
	while(true) {
#ifdef _WIN32
		Sleep(100);
#else
		sleep(1000);
#endif
	}
	ovr_Shutdown();
}

