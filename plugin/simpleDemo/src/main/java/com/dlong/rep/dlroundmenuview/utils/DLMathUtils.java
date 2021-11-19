package com.dlong.rep.dlroundmenuview.utils;

public class DLMathUtils {
    public DLMathUtils() {
    }

    public static double getDistanceFromTwoSpot(float x1, float y1, float x2, float y2) {
        float width;
        if (x1 > x2) {
            width = x1 - x2;
        } else {
            width = x2 - x1;
        }

        float height;
        if (y1 > y2) {
            height = y1 - y2;
        } else {
            height = y2 - y1;
        }

        return Math.sqrt((double)(width * width + height * height));
    }

    public static double getRotationBetweenLines(float centerX, float centerY, float xInView, float yInView) {
        double rotation = 0.0D;
        double k1 = (double)(centerY - centerY) / (double)(centerX * 2.0F - centerX);
        double k2 = (double)(yInView - centerY) / (double)(xInView - centerX);
        double tmpDegree = Math.atan(Math.abs(k1 - k2) / (1.0D + k1 * k2)) / 3.141592653589793D * 180.0D;
        if (xInView > centerX && yInView < centerY) {
            rotation = 90.0D - tmpDegree;
        } else if (xInView > centerX && yInView > centerY) {
            rotation = 90.0D + tmpDegree;
        } else if (xInView < centerX && yInView > centerY) {
            rotation = 270.0D - tmpDegree;
        } else if (xInView < centerX && yInView < centerY) {
            rotation = 270.0D + tmpDegree;
        } else if (xInView == centerX && yInView < centerY) {
            rotation = 0.0D;
        } else if (xInView == centerX && yInView > centerY) {
            rotation = 180.0D;
        }

        return rotation;
    }
}

