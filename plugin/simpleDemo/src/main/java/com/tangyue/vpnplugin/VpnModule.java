package com.tangyue.vpnplugin;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.VpnService;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;

import com.alibaba.fastjson.JSONObject;
import com.fisec.demo_fmcrypto_fmssl.SingletonVpn;
import com.fisec.demo_fmcrypto_fmssl.noticeDelegate;
import com.fisec.demo_fmcrypto_fmssl.ssl_pro.fmVpnService;

import org.apache.commons.net.telnet.TelnetClient;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalTime;
import java.util.Timer;
import java.util.TimerTask;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class VpnModule extends StandardFeature implements noticeDelegate, Runnable {
    Context context;
    SingletonVpn mVpn; //vpn单例对象
    Activity _activity; // 开启 vpn 中的 activity
    IWebview _pWebview; // 开启 vpn 中的 pWebview
    String _callBackID; // 开启 vpn 中的 callBackID
    int _startCode = -1; // 开启 vpn 返回 code
    String _startMsg; // 开启 vpn 返回 msg
    String tcpIp = "59.195.207.1"; // ping 地址
//    String tcpIp = "47.92.131.207"; // ping 地址
//    String tcpIp = "baidu.com";
    int tcpPort = 8081; // port
    private String returnValue; // telnet 检测返回值

    // 初始化 vpn
    public void initVpn(IWebview pWebview, JSONArray array) throws JSONException, InterruptedException {
        Log.e("VpnModule", "initVpn 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);
        org.json.JSONObject options = array.optJSONObject(1);
        String _ip = options.getString("ip");
        int _tport = options.getInt("tport");
        int _uport = options.getInt("uport");
        int _timeout = options.getInt("timeout");

        context = this.mApplicationContext;
        // vpn单例对象赋值
        mVpn = SingletonVpn.getInstance(context);
        mVpn.setNotice(this::SSLNotice);

        int ret = -1; // 结果
        JSONObject data = new JSONObject(); // 返回结果

        // ping 结果
//        String pingResult = pingCheckFun(tcpIp);
        // Telnet 结果
        String pingResult = TelnetCheckFun();

        if (pingResult.equals("success")) { // ping 成功
            ret = 2;
            data.put("code", ret);
            data.put("msg", "网络环境检测完成");
        }

        if (ret != 2) { // 如果不连通
            ret = mVpn.InitVpn(); // 初始化 vpn
            data.put("code", ret);

            if (ret == 0) {
                // 初始化成功设置vpn网络要素 223.99.220.203 9003
                mVpn.setConnecions(_ip, _tport, _uport, _timeout);
                // mVpn.setConnecions("1.71.182.98", 8443, 0, 5);
                data.put("msg", "初始化成功，请后续操作");
            } else {
                data.put("msg", "初始化失败，请检查权限");
            }
        }

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebview, CallBackID, _response, JSUtil.OK, false);
    }

    /**
     * @fn pingCheckFun
     * @param _tcpIp String 要 ping 的网站和 ip
     * @return String success|fail 成功|失败
     * @brief 对地址进行 ping 操作，返回成功、失败
     */
    public String pingCheckFun(String _tcpIp) {
        String _pingResult = "";
        Process p;
        try {
            // ping -c 3 -w 100  中  ，-c 是指ping的次数 3是指ping 3次 ，-w 100  以秒为单位指定超时间隔，是指超时时间为100秒
            // -w deadline，注，这是小写的w，deadline中文含义为“最后期限”，其作用就是设置整个ping过程的时间，
            p = Runtime.getRuntime().exec("ping -c 5 -w 5 " + _tcpIp);

            int status = p.waitFor();
            InputStream input = p.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(input));
            StringBuilder buffer = new StringBuilder();
            String line = "";

            while ((line = in.readLine()) != null) {
                buffer.append(line);
            }

            System.out.println("Ping return: " + buffer.toString());
            System.out.println("Ping status return: " + status);

            Pattern _pattern = Pattern.compile("\\d+% packet loss");
            Matcher _matcher = _pattern.matcher(buffer.toString());
            String regexResult = ""; // 正则匹配结果
            int losePercent = 0; // 丢包率

            if (_matcher.find()) {
                MatchResult _matchResult = _matcher.toMatchResult();
                regexResult = _matchResult.group();

                System.out.println("Ping 正则匹配结果：" + regexResult);
            }

            String _loseString = regexResult.replaceAll("[^0-9]", ""); // 去除非数字字符串
            losePercent = Integer.parseInt(!_loseString.equals("") ? _loseString : "0"); // 转换为数字

            Log.e("Ping", "Ping 丢包率：" + losePercent);

            if (status == 0) { // 全部成功
                _pingResult = "success";
            } else if (status == 1 && losePercent <= 40){ // 部分成功，且丢包率小于等于 40%
                _pingResult = "success";
            } else { // 失败
                _pingResult = "fail";
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        Log.e("ping", "<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>> " + _pingResult);

        return _pingResult;
    }

    /**
     * @fn TelnetCheckFun
     * @brief 使用 telnet 检测网络连通，相关变量及函数为 returnValue、run()、getReturnValue()
     * @return String ("success" | "fail")
     * @throws InterruptedException 线程阻塞
     */
    public String TelnetCheckFun() throws InterruptedException {
        VpnModule _vpnModule = new VpnModule();
        Thread thread = new Thread(_vpnModule);

        thread.start();

        thread.join();

        return _vpnModule.getReturnValue();
    }

    @Override
    public void run() {
        TelnetClient telnet = new TelnetClient();

        try {
            telnet.setConnectTimeout(3000);
            telnet.connect(tcpIp, tcpPort);

            returnValue = "success";
            System.out.println("333333333333333");
        } catch (IOException e) {
            returnValue = "fail";

            System.out.println("44444444444444");
            e.printStackTrace();
        }

        Log.e("ping", "<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>> " + returnValue);
    }

    public String getReturnValue(){
        return returnValue;
    }

    // 登录 vpn
    public void loginVpn(IWebview pWebview, JSONArray array) throws JSONException {
        Log.e("VpnModule", "loginVpn 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);
        org.json.JSONObject options = array.optJSONObject(1);
        String _account = options.getString("account");
        String _password = options.getString("password");

        int ret = -1; // 结果
        String _cacheMsg = "";
        JSONObject data = new JSONObject(); // 返回结果

        ret = mVpn.login(_account, _password); // 登录
        data.put("code", ret);

        switch (ret) {
            case 0:
                _cacheMsg = "登录成功，下一步请开启vpn";
                break;
            case -1:
                _cacheMsg = "登录失败";
                break;
            case -2:
                _cacheMsg = "协商失败";
                break;
            case -3:
                _cacheMsg = "未设置相关Ip及端口";
                break;
            case 2:
                _cacheMsg = "用户不存在";
                break;
            case 6:
                _cacheMsg = "密码错误";
                break;
            case 18:
                _cacheMsg = "用户已登录";
                break;
        }

        data.put("msg", _cacheMsg);

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebview, CallBackID, _response, JSUtil.OK, false);
    }

    // 开启 vpn
    public void startVpn(IWebview pWebview, JSONArray array) {
        Log.e("VpnModule", "startVpn 成功调用!");
        System.out.println(array);

        // 参数获取
        _callBackID = array.optString(0);
        _pWebview = pWebview;

        Intent intent = VpnService.prepare(context); // 查看当前手机是否含有当前程序建立的 vpn
        _activity = _pWebview.getActivity();

        Log.e("tag", "===========" + _activity);

        Log.e("tag", "intent:" + intent);

        if (intent != null) {
            // 注册系统事件，用于监听 Activity 回调
            registerSysEvent(pWebview, SysEventType.onActivityResult);

            // 开启系统确认弹窗
            _activity.startActivityForResult(intent, 0);
        } else {
            onActivityResult(0, Activity.RESULT_OK, null);
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        Log.e("TAG", "request: " + request);

        if (result == Activity.RESULT_OK) {
            // 开启 vpn
            _activity.startService(new Intent(context, fmVpnService.class));
        } else {
            // 系统确认弹窗点击取消，失败回调
            JSUtil.execCallback(_pWebview, _callBackID, "开启失败，请确认vpn连接请求", JSUtil.ERROR, false);
        }
    }

    // 计时器，判断第一次开启 vpn 状态（*****已弃用*****）
    public void checkStartStatus() {
        Timer _timer = new Timer();
        final int[] _totalTime = {0}; // 使用时长
        int _period = 1000; // 间隔时长

        TimerTask _task = new TimerTask() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void run() {
                onActivityResult(0, Activity.RESULT_OK, null);
                System.out.println(LocalTime.now());
                System.out.println("状态值：" + _startCode);

                _totalTime[0] += _period;

                JSONObject data = new JSONObject(); // 返回结果
                JSONArray _response = new JSONArray();

                // 回调成功
                if (_startCode == 0 || _startCode == 8) {
                    data.put("code", 0);
                    data.put("msg", "vpn 开启成功");

                    _response.put(data);

                    JSUtil.execCallback(_pWebview, _callBackID, _response, JSUtil.OK, false);
                    _timer.cancel();
                }

                // 30s 不成功进行失败回调
                if (_totalTime[0] > 30000) {
                    data.put("code", -1);
                    data.put("msg", "vpn 开启失败，请重新开启");

                    _response.put(data);

                    JSUtil.execCallback(_pWebview, _callBackID, _response, JSUtil.OK, false);
                    _timer.cancel();
                }
            }
        };

        _timer.schedule(_task, 1000, _period);
    }

    // 关闭并退出 vpn
    public void closeVpn(IWebview pWebview, JSONArray array) {
        Log.e("VpnModule", "closeVpn 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);

        mVpn.closeVPN(); // 关闭 VPN

        JSONObject data = new JSONObject(); // 返回结果
        data.put("code", 0);
        data.put("msg", "VPN已关闭！");

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebview, CallBackID, _response, JSUtil.OK, false);
    }

    // 检测当前 vpn 连接状态
    public void checkVpn(IWebview pWebview, JSONArray array) throws InterruptedException {
        Log.e("VpnModule", "checkVpn 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);

        JSONObject data = new JSONObject(); // 返回结果

        // ping 结果
//        String pingResult = pingCheckFun(tcpIp);

        // Telnet 结果
        String pingResult = TelnetCheckFun();

        if (pingResult.equals("success")) { // ping 成功
            data.put("code", 2);
            data.put("msg", "网络环境检测完成");
        } else if (mVpn.checkVPN()) { // vpn 在线
            data.put("code", 0);
            data.put("msg", "vpn已开启！");
        } else {
            data.put("code", -1);
            data.put("msg", "vpn未开启！");
        }

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebview, CallBackID, _response, JSUtil.OK, false);
    }

    // 设置 vpn 模式：0: vpn连接后可访问互联网资源； 1：vpn连接后只可访问内部资源
    // 调用startVPN前，设置模式，可实现vpn开启后的，网络资源访问情况，0内外网模式，1只有内网模式。
    public void setVpnMode(IWebview pWebview, JSONArray array) throws JSONException {
        Log.e("VpnModule", "setVpnMode 成功调用!");
        System.out.println(array);

        // 参数获取
        String CallBackID = array.optString(0);
        org.json.JSONObject options = array.optJSONObject(1);
        int _mode = options.getInt("mode");

        mVpn.setNetMode(_mode);

        JSONObject data = new JSONObject(); // 返回结果

        data.put("code", 0);

        if (_mode == 0) {
            data.put("msg", "vpn设置成功，vpn连接后可访问互联网资源，请重新登录VPN！");
        } else {
            data.put("msg", "vpn设置成功，vpn连接后只可访问内部资源，请重新登录VPN！");
        }

        JSONArray _response = new JSONArray();
        _response.put(data);

        JSUtil.execCallback(pWebview, CallBackID, _response, JSUtil.OK, false);
    }

    // Vpn 状态
    public void SSLNotice(int i) {
        String vpnMsg = "";

        switch (i) {
            case 0:
                vpnMsg = "vpn已开启";
                break;
            case 5:
                vpnMsg = "vpn已断开";
                break;
            case 6:
                vpnMsg = "资源 配置异常 请检查该用户分配的资源！";
                break;
            case 7:
                vpnMsg = "无法保护Tunnel，隧道异常";
                break;
            case 8:
                vpnMsg = "已开启vpn隧道，不能重复开启";
                break;
            case 9:
                vpnMsg = "未登录，无法开启vpn";
                break;
        }

        // _startCode = i;
        _startMsg = vpnMsg;

        System.out.println(vpnMsg);

        JSONObject data = new JSONObject(); // 返回结果
        data.put("code", i);
        data.put("msg", vpnMsg);

        JSONArray _response = new JSONArray();
        _response.put(data);

        if (_pWebview != null) {
            JSUtil.execCallback(_pWebview, _callBackID, _response, JSUtil.OK, false);

            // 登录后清空状态
            _pWebview = null;
            _callBackID = "";
        }
    }
}