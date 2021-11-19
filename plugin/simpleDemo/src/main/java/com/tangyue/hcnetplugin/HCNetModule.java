package com.tangyue.hcnetplugin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Looper;
import android.util.Log;
import android.view.SurfaceView;
import android.widget.Button;

import com.alibaba.fastjson.JSONObject;
import com.example.uniplugin_hk.HkVideoActivity;
import com.hcnetsdk.jna.HCNetSDKJNAInstance;
import com.hik.netsdk.SimpleDemo.Control.DevManageGuider;
import com.hik.netsdk.SimpleDemo.Control.SDKGuider;
import com.hikvision.netsdk.ExceptionCallBack;
import com.hikvision.netsdk.HCNetSDK;
import com.hikvision.netsdk.NET_DVR_DEVICEINFO_V30;

import org.json.JSONArray;
import org.json.JSONException;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class HCNetModule extends StandardFeature {
    public static final String TAG = "HkVideoActivity";
    private String url;
    private String userName;
    private String password;
    private Integer port;
    private Integer channelId;
    private boolean isFull;
    private boolean isInitSdk;
    private boolean isLogin;
    private Button btnLarge;
    private Button btnSmall;
    private Button btnStart;
    private SurfaceView surfaceView;
    private int playPort = -1;
    private int playId = -1;
    private NET_DVR_DEVICEINFO_V30 m_oNetDvrDeviceInfoV30;
    private int loginId = -1;
    private int m_iPlaybackID = -1;
    private boolean isPTZ = false;
    private IntentFilter intentFilter;
    private BroadcastReceiver broadcastReceiver;

    /**
     * @fn createHCVideo
     * @param pWebView IWebview
     * @param array JSONArray
     * @brief 创建并开启海康监控视频.
     */
    public void createHCVideo(IWebview pWebView, JSONArray array) throws JSONException {
        Context context = this.mApplicationContext;
        Intent intent = new Intent(context, HkVideoActivity.class);

        // 参数获取
        String CallBackID = array.optString(0);
        org.json.JSONObject options = array.optJSONObject(1);

        // 返回结果
        JSONArray _response = new JSONArray();
        JSONObject data = new JSONObject(); // 返回内容

        // 初始化 sdk 成功
        if (initNetSdk()) {
            Log.e("HCNetModule", "addHCNetDevice 成功调用!");
            System.out.println(array);

            String _deviceName = options.getString("deviceName"); // 设备名
            String _ip = options.getString("ip"); // 设备 ip
            String _port = String.valueOf(options.getInt("port")); // 设备端口号
            String _username = options.getString("username"); // 用户名
            String _password = options.getString("password"); // 密码

            DevManageGuider.DeviceItem deviceItem = SDKGuider.g_sdkGuider.m_comDMGuider.new DeviceItem();
            deviceItem.m_szDevName = _deviceName;
            deviceItem.m_struNetInfo = SDKGuider.g_sdkGuider.m_comDMGuider.new DevNetInfo(_ip, _port, _username, _password);

            // 判断设备名是否为空
            if(deviceItem.m_szDevName.isEmpty())
            {
                deviceItem.m_szDevName = deviceItem.m_struNetInfo.m_szIp;
            }

            // 登录成功
            if (SDKGuider.g_sdkGuider.m_comDMGuider.login_v40_jna(deviceItem.m_szDevName, deviceItem.m_struNetInfo)) {
                data.put("code", 0);
                data.put("msg", "start device success!");

                // 跳转原生页面
                Activity _activity = pWebView.getActivity();

                HkVideoActivity.instance(_activity, HkVideoActivity.class, null);
            } else {
                data.put("code", -1);
                data.put("msg", getErrMsg(SDKGuider.g_sdkGuider.GetLastError_jni()));
                Log.e("MainActivity", "错误代码：" + SDKGuider.g_sdkGuider.GetLastError_jni());
            }

            _response.put(data);

            JSUtil.execCallback(pWebView, CallBackID, _response, JSUtil.OK, false);
        } else {
            JSUtil.execCallback(pWebView, CallBackID, "sdk 初始化失败", JSUtil.ERROR, false);
        }
    }

    @Override
    public void onActivityResult (int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1 && resultCode == 2) {
            String acquiredData = data.getStringExtra("data");
            assert acquiredData != null;
            Log.e("MainActivity", acquiredData);
        }
    }

    private String getErrMsg(int errCode) {
        String errMsg;
        switch(errCode) {
            case 7:
                errMsg = "连接设备失败，设备不在线或网络原因引起的连接超时";
                break;
            case 8:
                errMsg = "向设备发送命令失败";
                break;
            case 9:
                errMsg = "从设备接收数据失败";
                break;
            case 10:
                errMsg = "从设备接收数据超时";
                break;
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            default:
                errMsg = "操作失败";
                break;
            case 18:
                errMsg = "设备通道处于错误状态";
        }

        return errMsg;
    }

    /**
     * @fn initHCNet
     * @brief NetSDK初始化.
     */
    @SuppressLint("SdCardPath")
    private boolean initNetSdk() {
        Log.e("HCNetModule", "initNetSdk 成功调用!");

        if (!HCNetSDK.getInstance().NET_DVR_Init()) {
            Log.e("HkVideoActivity", "HCNetSDK init is failed!");
            return false;
        } else {
            int sdkVer = HCNetSDK.getInstance().NET_DVR_GetSDKVersion();
            Log.i("HkVideoActivity", "HCNetSDK init is Success");
            Log.i("HkVideoActivity", "sdkVer  " + sdkVer);
            boolean setTime = HCNetSDK.getInstance().NET_DVR_SetConnectTime(60);
            Log.i("HkVideoActivity", "设置网络连接超时时间 60S   " + setTime);
            boolean RecvTimeOut = HCNetSDK.getInstance().NET_DVR_SetRecvTimeOut(60);
            Log.i("HkVideoActivity", "设置接收超时时间 60S   " + RecvTimeOut);
            HCNetSDKJNAInstance.getInstance().NET_DVR_SetLogToFile(3, "/mnt/sdcard/HkVideoLog/", true);
            return true;
        }
    }

    private int loginDev() {
        this.m_oNetDvrDeviceInfoV30 = new NET_DVR_DEVICEINFO_V30();
        int iLogID = HCNetSDK.getInstance().NET_DVR_Login_V30(this.url, this.port, this.userName, this.password, this.m_oNetDvrDeviceInfoV30);
        if (iLogID < 0) {
            return -1;
        } else {
            ExceptionCallBack oExceptionCbf = new ExceptionCallBack() {
                public void fExceptionCallBack(int iType, int iUserID, int iHandle) {
                    switch(iType) {
                        case 32771:
                            (new Thread(new Runnable() {
                                public void run() {
                                    Looper.prepare();
//                                    Toast.makeText(HkVideoActivity.this, "网络预览异常", 0).show();
                                    Log.e("HkVideoActivity", "网络预览异常!");
                                    Looper.loop();
                                }
                            })).start();
                            break;
                        case 32773:
                            (new Thread(new Runnable() {
                                public void run() {
                                    Looper.prepare();
//                                    Toast.makeText(HkVideoActivity.this, "正在重新连接", 0).show();
                                    Log.e("HkVideoActivity", "正在重新连接!");
                                    Looper.loop();
                                }
                            })).start();
                            break;
                        case 32789:
                            (new Thread(new Runnable() {
                                public void run() {
                                    Looper.prepare();
//                                    Toast.makeText(HkVideoActivity.this, "重新连接成功", 0).show();
                                    Log.e("HkVideoActivity", "重新连接成功!");
                                    Looper.loop();
                                }
                            })).start();
                            break;
                        default:
                            Log.e("HkVideoActivity", "recv exception, type:" + iType);
                    }

                }
            };
            if (!HCNetSDK.getInstance().NET_DVR_SetExceptionCallBack(oExceptionCbf)) {
                Log.e("HkVideoActivity", "NET_DVR_SetExceptionCallBack is failed!");
//                Toast.makeText(this.getApplicationContext(), "NET_DVR_SetExceptionCallBack is failed!", 1).show();
                return -1;
            } else {
                return iLogID;
            }
        }
    }

    /**
     * @fn addHCNetDevice
     * @param pWebView, array
     * @brief 新增设备.
     */
    public void addHCNetDevice(IWebview pWebView, JSONArray array) throws JSONException {
        Log.e("HCNetModule", "addHCNetDevice 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);
        org.json.JSONObject options = array.optJSONObject(1);
        String _deviceName = options.getString("deviceName"); // 设备名
        String _ip = options.getString("ip"); // 设备 ip
        String _port = String.valueOf(options.getInt("port")); // 设备端口号
        String _username = options.getString("username"); // 用户名
        String _password = options.getString("password"); // 密码

        DevManageGuider.DeviceItem deviceItem = SDKGuider.g_sdkGuider.m_comDMGuider.new DeviceItem();
        deviceItem.m_szDevName = _deviceName;
        deviceItem.m_struNetInfo = SDKGuider.g_sdkGuider.m_comDMGuider.new DevNetInfo(_ip, _port, _username, _password);
        if(deviceItem.m_szDevName.isEmpty())
        {
            deviceItem.m_szDevName = deviceItem.m_struNetInfo.m_szIp;
        }

        // 结果
        JSONObject data = new JSONObject(); // 返回结果

        if (SDKGuider.g_sdkGuider.m_comDMGuider.login_v40_jna(deviceItem.m_szDevName, deviceItem.m_struNetInfo)) {
            data.put("code", 0);
            data.put("msg", "add device succ!");
        } else {
            data.put("code", -1);
            data.put("msg", "add device failed with " + SDKGuider.g_sdkGuider.GetLastError_jni());
        }

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebView, CallBackID, _response, JSUtil.OK, false);
    }
}
