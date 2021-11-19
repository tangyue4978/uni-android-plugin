package com.tangyue.hcnetplugin;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

public class MyActivityBase extends AppCompatActivity {
    public static void instance(Context context, Class<?> cType, Bundle args){
        Intent intent = new Intent(context, cType);
        if(args !=null){
            intent.putExtras(args);
        }
        context.startActivity(intent);
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
