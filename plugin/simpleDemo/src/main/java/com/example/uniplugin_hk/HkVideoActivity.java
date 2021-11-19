package com.example.uniplugin_hk;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Looper;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.dlong.rep.dlroundmenuview.DLRoundMenuView;
import com.dlong.rep.dlroundmenuview.Interface.OnMenuTouchListener;
import com.dlong.rep.dlroundmenuview.utils.DLMathUtils;
import com.hik.netsdk.SimpleDemo.Control.DevManageGuider;
import com.hik.netsdk.SimpleDemo.Control.SDKGuider;
import com.hikvision.netsdk.ExceptionCallBack;
import com.hikvision.netsdk.HCNetSDK;
import com.hikvision.netsdk.NET_DVR_DEVICEINFO_V30;
import com.hikvision.netsdk.NET_DVR_JPEGPARA;
import com.hikvision.netsdk.NET_DVR_PREVIEWINFO;
import com.tangyue.hcnetplugin.HCNetModule;
import com.tangyue.hcnetplugin.MyActivityBase;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import water.oa.android.R;

public class HkVideoActivity extends MyActivityBase implements View.OnClickListener,Callback {
    public static final String TAG = "HkVideoActivity";
    private String url;
    private String userName;
    private String password;
    private Integer port;
    private Integer channelId;
    private boolean isFull;
    private boolean isInitSdk;
    private boolean isLogin;
    private Button btnZoomIn; // 放大按钮
    private Button btnZoomOut; // 缩小按钮
    private Button btnStart;
    private DLRoundMenuView dlRoundMenuView;
    private SurfaceView surfaceView;
    private Button backBtn;
    private int playPort = -1;
    private int playId = -1;
    private NET_DVR_DEVICEINFO_V30 m_oNetDvrDeviceInfoV30;
    private int loginId = -1;
    private int m_iPlaybackID = -1;
    private boolean isPTZ = false;
    private IntentFilter intentFilter;
    private BroadcastReceiver broadcastReceiver;
    private ProgressBar pgsBar; // loading

    // 码流类型
    enum streamTypeList
    {
        MainStream, // 0-主码流
        SubStream, // 1-子码流
        EventStream, // 2-事件类型
        CodeStream, // 3-码流
        VirtualStream, // 4-虚拟码流
    }

    int _currentLoginId = -1; // 当前登录id
    DevManageGuider.DeviceItem deviceInfo; // 当前设备信息

    private SurfaceView m_osurfaceView = null;
    private int m_iPreviewHandle = -1; // playback
    private int m_iSelectChannel = -1; // 通道号，取值在登录接口返回
    private int m_iSelectStreamType = -1; // 码流类型
    private int m_iUserID = -1; // return by NET_DVR_Login_v30


    private int m_byChanNum = 0;// analog channel nums
    private int m_byStartChan = 0;//start analog channel

    private int m_IPChanNum = 0;//digital channel nums
    private int m_byStartDChan = 0;//start digital channel

    private List<String> m_data_list_channel, m_data_list_stream;
    private Spinner m_bystream_spinner, m_bychannel_spinner;
    private ArrayAdapter<String> m_streamtype_adapter, m_arrchannel_adapter;

    public HkVideoActivity() {
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 沉浸式导航栏
        if(Build.VERSION.SDK_INT >= 21) {
            Window window = getWindow();
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            window.setStatusBarColor(Color.TRANSPARENT);
        }

        setContentView(R.layout.activity_hk_video);

        findViewById(R.id.button7).setOnClickListener((OnClickListener) this);
        this.initBtnView();

        // 设备信息
        _currentLoginId = SDKGuider.g_sdkGuider.m_comDMGuider.getCurrentLoginID();
        deviceInfo = SDKGuider.g_sdkGuider.m_comDMGuider.getDevByUserID(_currentLoginId);

        // 标题栏内容
        System.out.println(deviceInfo.m_szDevName + "=====================");
//        this.setTitle(deviceInfo.m_szDevName);
        TextView textView = (TextView)findViewById(R.id.toolbar_img_title);

        textView.setText(deviceInfo.m_szDevName);
//        if (getSupportActionBar() != null) {
//            getSupportActionBar().hide();
//        }

        // 设置左上角返回键
//        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        pgsBar = (ProgressBar) findViewById(R.id.pBar); // 页面中间 loading

        if(deviceInfo == null){
            Toast.makeText(HkVideoActivity.this,"获取设备信息失败",Toast.LENGTH_SHORT).show();
            return;
        }

        m_iUserID = deviceInfo.m_lUserID;
        m_byChanNum = deviceInfo.m_struDeviceInfoV40_jna.struDeviceV30.byChanNum; // 设备模拟通道个数
        m_byStartChan = deviceInfo.m_struDeviceInfoV40_jna.struDeviceV30.byStartChan; // 模拟通道起始通道号

        m_IPChanNum = deviceInfo.m_struDeviceInfoV40_jna.struDeviceV30.byIPChanNum + deviceInfo.m_struDeviceInfoV40_jna.struDeviceV30.byHighDChanNum * 256; // 设备最大数字通道个数，低 8 位 + 数字通道个数，高 8 位
        m_byStartDChan = deviceInfo.m_struDeviceInfoV40_jna.struDeviceV30.byStartChan ; // 起始数字通道号

        m_iSelectStreamType = 0; // 码流类型
        m_iSelectChannel = 1; // 通道号

        // 播放区域 Surface
        m_osurfaceView = findViewById(R.id.surfaceView);
        m_osurfaceView.getHolder().addCallback(this);
        m_osurfaceView.setZOrderOnTop(true);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    private boolean haveNavgtion() {
        //屏幕的高度  真实物理的屏幕
        Display display = getWindowManager().getDefaultDisplay();
        DisplayMetrics displayMetrics = new DisplayMetrics();
        display.getRealMetrics(displayMetrics);
        int heightDisplay = displayMetrics.heightPixels;
        //为了防止横屏
        int widthDisplay = displayMetrics.widthPixels;
        DisplayMetrics contentDisplaymetrics = new DisplayMetrics();
        display.getMetrics(contentDisplaymetrics);
        int contentDisplay = contentDisplaymetrics.heightPixels;
        int contentDisplayWidth = contentDisplaymetrics.widthPixels;
        //屏幕内容高度  显示内容的屏幕
        int w = widthDisplay - contentDisplayWidth;
        //哪一方大于0   就有导航栏
        int h = heightDisplay - contentDisplay;
        return w > 0 || h > 0;
    }

    private int getStatusHeight() {
        int height = -1;
        try {
            Class<?> clazz = Class.forName("com.android.internal.R$dimen");
            Object object = clazz.newInstance();
            String heightStr = clazz.getField("status_bar_height").get(object).toString();
            height = Integer.parseInt(heightStr);
            //dp--px
            height = getResources().getDimensionPixelSize(height);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }


        return height;
    }

    public String GetChannel(String inPutStr) {
        String regEx="[^0-9]";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(inPutStr);
        return m.replaceAll("").trim();
    }

    /**
     * @fn onClick
     * @param v View
     * @brief 点击开始播放按钮监听
     */
    @SuppressLint("NonConstantResourceId")
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button7:
                if(m_iPreviewHandle != -1){
                    SDKGuider.g_sdkGuider.m_comPreviewGuider.RealPlay_Stop_jni(m_iPreviewHandle);
                }

                NET_DVR_PREVIEWINFO struPlayInfo = new NET_DVR_PREVIEWINFO();
                struPlayInfo.lChannel = m_iSelectChannel;
                struPlayInfo.dwStreamType = m_iSelectStreamType;
                struPlayInfo.bBlocked = 1;
                m_osurfaceView = findViewById(R.id.surfaceView);
                struPlayInfo.hHwnd = m_osurfaceView.getHolder();
                m_iPreviewHandle = SDKGuider.g_sdkGuider.m_comPreviewGuider.RealPlay_V40_jni(m_iUserID,struPlayInfo, null);
                if (m_iPreviewHandle < 0)
                {
                    Toast.makeText(HkVideoActivity.this, getErrMsg(SDKGuider.g_sdkGuider.GetLastError_jni()), Toast.LENGTH_SHORT).show();
                    Log.e("fail", "NET_DVR_RealPlay_V40 fail, Err:"+ SDKGuider.g_sdkGuider.GetLastError_jni());
                    return;
                }
//                Toast.makeText(HkVideoActivity.this,"NET_DVR_RealPlay_V40 Succ " ,Toast.LENGTH_SHORT).show();

                break;
        }
    }

    // 初始化其他 button
    @SuppressLint("ClickableViewAccessibility")
    private void initBtnView() {
        this.btnZoomIn = findViewById(R.id.button6);
        this.btnZoomOut = findViewById(R.id.button5);
        this.dlRoundMenuView = (DLRoundMenuView)this.findViewById(R.id.dl_rmv);
        this.backBtn = this.findViewById(R.id.buttonBack);

        // 返回上一页
        this.backBtn.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                pgsBar.setVisibility(View.VISIBLE);
                finish();
                stopPreview();

                return false;
            }
        });

        // 放大
        this.btnZoomIn.setOnTouchListener(new OnTouchListener() {
            @SuppressLint({"WrongConstant", "ShowToast"})
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                int action = event.getAction(); // touch 事件类型
                int errCode; // 错误码

                if (m_iPreviewHandle < 0) { // 视频没有启动预览
                    Toast.makeText(HkVideoActivity.this, "请先开启视频预览", 1).show();
                    return false;
                }

                switch (action) {
                    case MotionEvent.ACTION_DOWN: // 开始放大
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, 11, 0)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                    case MotionEvent.ACTION_UP: // 停止放大
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, 11, 1)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                }

                return true;
            }
        });

        // 缩小
        this.btnZoomOut.setOnTouchListener(new OnTouchListener() {
            @SuppressLint({"WrongConstant", "ShowToast"})
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                int action = event.getAction(); // touch 事件类型
                int errCode; // 错误码

                if (m_iPreviewHandle < 0) { // 视频没有启动预览
                    Toast.makeText(HkVideoActivity.this, "请先开启视频预览", 1).show();
                    return false;
                }

                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        // 开始缩小
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, 12, 0)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                    case MotionEvent.ACTION_UP:
                        // 停止缩小
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, 12, 1)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                }

                return true;
            }
        });

        // 其他功能性按钮
        this.dlRoundMenuView.setOnMenuTouchListener(new OnMenuTouchListener() {
            @SuppressLint("SdCardPath")
            @Override
            public boolean OnTouch(MotionEvent event) {
                int action = event.getAction(); // touch 事件类型
                int errCode; // 错误码

                if (m_iPreviewHandle < 0) { // 视频没有启动预览
                    Toast.makeText(HkVideoActivity.this, "请先开启视频预览", 1).show();
                    return false;
                }

                float textX = event.getX(); // 点击时位置在 button 中的横坐标
                float textY = event.getY(); // 点击时位置在 button 中的纵坐标
                float mCoreX = HkVideoActivity.this.getValue(HkVideoActivity.this.dlRoundMenuView, "mCoreX"); // 中心点在 button 中的横坐标
                float mCoreY = HkVideoActivity.this.getValue(HkVideoActivity.this.dlRoundMenuView, "mCoreY"); // 中心点在 button 中的纵坐标
                Float mRoundMenuNumber = HkVideoActivity.this.getValue(HkVideoActivity.this.dlRoundMenuView, "mRoundMenuNumber"); // 菜单总个数
                double distance = DLMathUtils.getDistanceFromTwoSpot(mCoreX, mCoreY, textX, textY); // 与中心点之间的距离
                double centerCircleRadius = (double)HkVideoActivity.this.getValue(HkVideoActivity.this.dlRoundMenuView, "mCoreMenuRoundRadius"); // 中心原半径
                int onClickState; // 点击区域

                System.out.printf("================= getXY:(%s, %s), mCoreXY:(%s, %s), distance: %s, roundMenuNumber: %s, centerCircleRadius: %s%n", textX, textY, mCoreX, mCoreY, distance, mRoundMenuNumber, centerCircleRadius);

                if (distance <= centerCircleRadius) { // 在内部圆中点击
                    onClickState = -1;
                } else if (distance <= (double)(HkVideoActivity.this.dlRoundMenuView.getWidth() / 2)) { // 点击在大圆内部
                    float sweepAngle = 360.0F / mRoundMenuNumber; // 90度
                    double angle = DLMathUtils.getRotationBetweenLines(mCoreX, mCoreY, textX, textY); // 计算从正上方0度开始的夹角
                    double _degree = (double)HkVideoActivity.this.getValue(HkVideoActivity.this.dlRoundMenuView, "mRoundMenuDeviationDegree").intValue(); // 偏移量，默认为 0
                    angle = (angle + 360.0D + (double)(sweepAngle / 2.0F) - _degree) % 360.0D; // angle = (angle + 360 + 45) % 360
                    onClickState = (int)(angle / (double)sweepAngle);
                    if ((float)onClickState >= mRoundMenuNumber) { // 上方左侧
                        onClickState = 0;
                    }
                } else { // 点击在 view 内部，圆外部的四角区域
                    onClickState = -2;
                }

                int command = 1; // 云台动作控制命令
                switch(onClickState) {
                    case 0:
                        command = 21; // 云台上仰
                        break;
                    case 1:
                        command = 24; // 云台右转
                        break;
                    case 2:
                        command = 22; // 云台下俯
                        break;
                    case 3:
                        command = 23; // 云台左转
                }

                if (onClickState == -1) { // 中心区域
                    NET_DVR_JPEGPARA strJpeg = new  NET_DVR_JPEGPARA();
                    strJpeg.wPicQuality = 2;
                    strJpeg.wPicSize = 2;

//                    HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, 29, 1);

                    // 截图
                    if (!HCNetSDK.getInstance().NET_DVR_CaptureJPEGPicture(m_iUserID, m_iSelectChannel, strJpeg, "/sdcard/cap.jpg")) {
                        errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                        Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                    } else {
                        Toast.makeText(HkVideoActivity.this, "NET_DVR_CaptureJPEGPicture! succeed", 1).show();
                    }
                }

                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        // 开始控制
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, command, 0)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                    case MotionEvent.ACTION_UP:
                        // 停止控制
                        if (!HCNetSDK.getInstance().NET_DVR_PTZControl(m_iPreviewHandle, command, 1)) {
                            errCode = HCNetSDK.getInstance().NET_DVR_GetLastError();
                            Toast.makeText(HkVideoActivity.this, HkVideoActivity.this.getErrMsg(errCode), 1).show();
                        }
                        break;
                }

                return true;
            }
        });
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
                errMsg = "操作失败。错误代码：" + errCode;
                break;
            case 18:
                errMsg = "设备通道处于错误状态";
        }

        return errMsg;
    }

    /**
     * 左上角返回键
     */
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            pgsBar.setVisibility(View.VISIBLE);
            finish();
            stopPreview();
        }
        return true;
    }

    /**
     * 返回键
     */
    public void onBackPressed() {
        stopPreview();
        pgsBar.setVisibility(View.VISIBLE);
        super.onBackPressed();
    }

    @SuppressLint("WrongConstant")
    public void stopPreview() {
        HCNetSDK.getInstance().NET_DVR_StopRealPlay(m_iPreviewHandle);
        this.stopPlayer();
        this.playId = -1;
//        this.btnStart.setVisibility(0);
    }

    private void stopPlayer() {
//        Player.getInstance().stopSound();
//        if (!Player.getInstance().stop(this.playPort)) {
//            Log.e("HkVideoActivity", "stop is failed!");
//        } else if (!Player.getInstance().closeStream(this.playPort)) {
//            Log.e("HkVideoActivity", "closeStream is failed!");
//        } else if (!Player.getInstance().freePort(this.playPort)) {
//            Log.e("HkVideoActivity", "freePort is failed!" + this.playPort);
//        } else {
//            this.playPort = -1;
//        }
    }

    public boolean isWifiConnect() {
        @SuppressLint("WrongConstant") ConnectivityManager connManager = (ConnectivityManager)this.getSystemService("connectivity");
        NetworkInfo mWifiInfo = connManager.getNetworkInfo(1);
        return mWifiInfo.isConnected();
    }

    protected void onPause() {
        super.onPause();
        this.stopPreview();
    }

    private Float getValue(Object o, String filedName) {
        try {
            Class<?> aClass = o.getClass();
            Field declaredField = aClass.getDeclaredField(filedName);
            declaredField.setAccessible(true);
            return Float.valueOf(Objects.requireNonNull(declaredField.get(o)).toString());
        } catch (Exception var5) {
            throw new RuntimeException(var5);
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {

    }

    public class WifiReceiver extends BroadcastReceiver {
        public WifiReceiver() {
        }

        public void onReceive(Context context, Intent intent) {
            if (!HkVideoActivity.this.isWifiConnect()) {
                HkVideoActivity.this.stopPreview();
            }

        }
    }
}
