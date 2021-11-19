package com.dlong.rep.dlroundmenuview.utils;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Bitmap.Config;
import android.graphics.drawable.Drawable;

public class DrawableUtils {
    public DrawableUtils() {
    }

    public static Bitmap drawableToBitmap(Drawable drawable) {
        if (null == drawable) {
            return null;
        } else {
            int width = drawable.getIntrinsicWidth();
            int height = drawable.getIntrinsicHeight();
            if (width > 0 && height > 0) {
                Config config = drawable.getOpacity() != -1 ? Config.ARGB_8888 : Config.RGB_565;
                Bitmap bitmap = Bitmap.createBitmap(width, height, config);
                Canvas canvas = new Canvas(bitmap);
                drawable.setBounds(0, 0, width, height);
                drawable.draw(canvas);
                return bitmap;
            } else {
                return null;
            }
        }
    }
}