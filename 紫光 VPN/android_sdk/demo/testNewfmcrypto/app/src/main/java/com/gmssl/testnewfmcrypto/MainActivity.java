package com.gmssl.testnewfmcrypto;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.net.VpnService;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;

import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.fisec.demo_fmcrypto_fmssl.LogbackCode;
import com.fisec.demo_fmcrypto_fmssl.SingletonVpn;
import com.fisec.demo_fmcrypto_fmssl.fmUtills.constants;
import com.fisec.demo_fmcrypto_fmssl.noticeDelegate;
import com.fisec.demo_fmcrypto_fmssl.ssl_pro.fmVpnService;

import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;

import static android.content.pm.PackageManager.PERMISSION_GRANTED;

public class MainActivity extends AppCompatActivity implements View.OnClickListener, noticeDelegate {
    private static Logger logger;
    //权限相关-需动态申请的权限为读写存储卡权限
    String[] permissions =new String[]{Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
    //尚未授权的权限存储
    List<String> mPermissionList=new ArrayList<>();
    //回调状态请求码
    private  final int mRequestCode = 100;
    //权限判断和申请
    private void initPermission(){
        mPermissionList.clear();
        for(int i=0;i<permissions.length;i++){
            if(ContextCompat.checkSelfPermission(this,permissions[i])!= PERMISSION_GRANTED){
                mPermissionList.add(permissions[i]);
            }
        }
        if(mPermissionList.size()>0){
            ActivityCompat.requestPermissions(this,permissions,mRequestCode);
        }else{
            //权限验证完毕进行操作。
            permissioned();
        }
    }
    //回调
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean hasPermissionDismiss = false;
        boolean allway=false;
        if(mRequestCode==requestCode){
            for(int i=0;i<grantResults.length;i++){
                if(grantResults[i]== PackageManager.PERMISSION_DENIED){
                    hasPermissionDismiss=true;
                    if(!ActivityCompat.shouldShowRequestPermissionRationale(this,permissions[i])){
                        //已选择禁止不再提示按钮，权限开启需要手动去设置
                        allway=true;
                    }
                    break;
                }
            }
            if(hasPermissionDismiss&&allway){
                //拒绝请求且不再提示，则弹出对话框
                AlertDialog alertDialog=new AlertDialog.Builder(this)
                        .setTitle("系统提示")
                        .setMessage("用户选择了不再提示按钮，获取相关权限【存储权限】失败将导致部分功能无法使用，需到设置页面手动授权")
                        .setPositiveButton("去授权",new DialogInterface.OnClickListener(){
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                Intent intent=new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                Uri uri=Uri.fromParts("package",getApplicationContext().getPackageName(),null);
                                intent.setData(uri);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK|Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                                dialogInterface.dismiss();
                            }
                        })
                        .setNegativeButton("取消",new DialogInterface.OnClickListener(){
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                dialogInterface.dismiss();
                                denied();
                            }
                        }).create();
                alertDialog.setCanceledOnTouchOutside(false);
                alertDialog.show();
            }else if(hasPermissionDismiss&&!allway){
                //拒绝请求但不是一直拒绝，则直接返回。
                denied();
            }else{
                //权限验证完毕进行操作
                permissioned();
            }
        }
    }

    /**
     * 弹出框显示
     * @param msg
     */
    public void showToast(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
            }
        });
    }

    //权限拒绝函数
    private void denied(){
        showToast("权限请求被拒绝");
    }

    private SingletonVpn mvpn; //vpn单例对象

    //权限允许函数-权限允许
    private void permissioned(){
        mvpn=SingletonVpn.getInstance(getApplicationContext());
        mvpn.setNotice(this::SSLNotice);
        LoggerContext fmSockChannel=(LoggerContext) LoggerFactory.getILoggerFactory();
        logger=fmSockChannel.getLogger(this.getClass().getName());
        logger.addAppender(LogbackCode.getInstance().getDayLog());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initview();
        initPermission();
    }
    public void initview(){
        findViewById(R.id.check).setOnClickListener(this);
        findViewById(R.id.login).setOnClickListener(this);
        findViewById(R.id.loginout).setOnClickListener(this);
        findViewById(R.id.startvpn).setOnClickListener(this);
        findViewById(R.id.init).setOnClickListener(this);
    }

    public void startVPN() {
        Intent intent = VpnService.prepare(this);
        if (intent != null) {
            startActivityForResult(intent, 0);
        } else {
            onActivityResult(0, RESULT_OK, null);
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (result == RESULT_OK) {
            startService(new Intent(this, fmVpnService.class));
        }
    }

    public void login(){
        // int ret = mvpn.login("ptuser1","Huawei12#$");
        //mvpn.setNetMode(0);
        int ret = mvpn.login("cs","12345678");
        if(ret==0){
            showToast("登录成功，下一步请开启vpn");
        }else{
            showToast("登录失败");
        }
    }

    @Override
    public void onClick(View view) {
        int ret=-1;
        switch (view.getId()) {
            case R.id.login:
                login();
                break;
            case R.id.loginout:
                mvpn.closeVPN();
                break;
            case R.id.startvpn:
                startVPN();
                break;
            case R.id.check:
                if(mvpn.checkVPN()){
                    showToast("vpn已开启");
                }else{
                    showToast("vpn未开启");
                }
                break;
            case R.id.init:
                ret = mvpn.InitVpn();
                //120.253.222.140
                if(ret==0){
                    //初始化成功设置vpn网络要素 223.99.220.203 9003
                    mvpn.setConnecions("61.146.213.176",8443,0,5);
                    showToast("初始化成功，请后续操作");
                }else{
                    showToast("初始化失败，请检查权限");
                }
                break;
        }

    }

    @Override
    public void SSLNotice(int i) {
        switch (i) {
            case 0:
                showToast("vpn已开启");
                break;
            case 5:
                showToast("vpn已断开");
                break;
            case 6:
                showToast("资源 配置异常 请检查该用户分配的资源！");
                break;
            case 7:
                showToast("无法保护Tunnel 隧道 异常");
                break;
            case 8:
                showToast("已开启vpn隧道，不能重复开启");
                break;
            case 9:
                showToast("未登录，无法开启vpn");
                break;
        }
    }
}