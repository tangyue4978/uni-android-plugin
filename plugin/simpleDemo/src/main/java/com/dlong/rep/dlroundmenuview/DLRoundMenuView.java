package com.dlong.rep.dlroundmenuview;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Paint.Style;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.MeasureSpec;
import com.dlong.rep.dlroundmenuview.Interface.OnMenuClickListener;
import com.dlong.rep.dlroundmenuview.Interface.OnMenuLongClickListener;
import com.dlong.rep.dlroundmenuview.Interface.OnMenuTouchListener;
import water.oa.android.R.bool;
import water.oa.android.R.color;
import water.oa.android.R.dimen;
import water.oa.android.R.drawable;
import water.oa.android.R.fraction;
import water.oa.android.R.integer;
import water.oa.android.R.styleable;
import com.dlong.rep.dlroundmenuview.utils.DLMathUtils;
import com.dlong.rep.dlroundmenuview.utils.DrawableUtils;
import java.util.ArrayList;
import java.util.Date;

public class DLRoundMenuView extends View {
    private Context mContext;
    public static final int DL_TOUCH_OUTSIDE = -2;
    public static final int DL_TOUCH_CENTER = -1;
    public int DL_DEFAULT_LONG_CLICK_TIME = 400;
    private float mCoreX;
    private float mCoreY;
    private boolean mHasCoreMenu;
    private int mCoreMenuNormalBackgroundColor;
    private int mCoreMenuStrokeColor;
    private float mCoreMenuStrokeSize;
    private int mCoreMenuSelectedBackgroundColor;
    private Bitmap mCoreMenuDrawable;
    private float mCoreMenuRoundRadius;
    private int mRoundMenuNumber;
    private float mRoundMenuDeviationDegree;
    private ArrayList<Bitmap> mRoundMenuDrawableList = new ArrayList();
    private boolean mIsDrawLineToCenter;
    private int mRoundMenuNormalBackgroundColor;
    private int mRoundMenuSelectedBackgroundColor;
    private int mRoundMenuStrokeColor;
    private float mRoundMenuStrokeSize;
    private float mRoundMenuDistance;
    private int onClickState = -2;
    private long mTouchTime;
    private OnMenuClickListener mMenuClickListener;
    private OnMenuLongClickListener mMenuLongClickListener;
    private OnMenuTouchListener mTouchListener;
    @SuppressLint({"HandlerLeak"})
    private Handler mHandler;

    public DLRoundMenuView(Context context) {
        super(context);
        this.mHandler = new Handler();
        this.init(context, (AttributeSet)null);
    }

    public DLRoundMenuView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        this.mHandler = new Handler();
        this.init(context, attrs);
    }

    public DLRoundMenuView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);

        class NamelessClass_1 extends Handler {
            NamelessClass_1() {
            }

            public void handleMessage(Message msg) {
                switch(msg.what) {
                    case 1:
                        if (DLRoundMenuView.this.mMenuLongClickListener != null) {
                            DLRoundMenuView.this.mMenuLongClickListener.OnMenuLongClick(DLRoundMenuView.this.onClickState);
                        }
                    default:
                }
            }
        }

        this.mHandler = new NamelessClass_1();
        this.init(context, attrs);
    }

    private void init(Context context, @Nullable AttributeSet attrs) {
        this.mContext = context;
        Resources res = this.getResources();
        boolean defaultHasCoreMenu = res.getBoolean(bool.default_has_core_menu);
        int defaultCoreMenuNormalBackgroundColor = res.getColor(color.default_core_menu_normal_background_color);
        int defaultCoreMenuStrokeColor = res.getColor(color.default_core_menu_stroke_color);
        float defaultCoreMenuStrokeSize = res.getDimension(dimen.default_core_menu_stroke_size);
        int defaultCoreMenuSelectedBackgroundColor = res.getColor(color.default_core_menu_selected_background_color);
        Drawable defaultCoreMenuDrawable = res.getDrawable(drawable.default_core_menu_drawable);
        float defaultCoreMenuRoundRadius = res.getDimension(dimen.default_core_menu_round_radius);
        int defaultRoundMenuNumber = res.getInteger(integer.default_round_menu_number);
        int defaultRoundMenuDeviationDegree = res.getInteger(integer.default_round_menu_deviation_degree);
        Drawable defaultRoundMenuDrawable = res.getDrawable(drawable.default_round_menu_drawable);
        boolean defaultIsDrawLineToCenter = res.getBoolean(bool.default_is_draw_line_to_center);
        int defaultRoundMenuNormalBackgroundColor = res.getColor(color.default_round_menu_normal_background_color);
        int defaultRoundMenuSelectedBackgroundColor = res.getColor(color.default_round_menu_selected_background_color);
        int defaultRoundMenuStrokeColor = res.getColor(color.default_round_menu_stroke_color);
        float defaultRoundMenuStrokeSize = res.getDimension(dimen.default_round_menu_stroke_size);
        float defaultRoundMenuDistance = res.getFraction(fraction.default_round_menu_distance, 1, 1);
        TypedArray a = this.mContext.obtainStyledAttributes(attrs, styleable.DLRoundMenuView);
        this.mHasCoreMenu = a.getBoolean(styleable.DLRoundMenuView_RMHasCoreMenu, defaultHasCoreMenu);
        this.mCoreMenuNormalBackgroundColor = a.getColor(styleable.DLRoundMenuView_RMCoreMenuNormalBackgroundColor, defaultCoreMenuNormalBackgroundColor);
        this.mCoreMenuStrokeColor = a.getColor(styleable.DLRoundMenuView_RMCoreMenuStrokeColor, defaultCoreMenuStrokeColor);
        this.mCoreMenuStrokeSize = a.getDimension(styleable.DLRoundMenuView_RMCoreMenuStrokeSize, defaultCoreMenuStrokeSize);
        this.mCoreMenuSelectedBackgroundColor = a.getColor(styleable.DLRoundMenuView_RMCoreMenuSelectedBackgroundColor, defaultCoreMenuSelectedBackgroundColor);
        this.mCoreMenuRoundRadius = a.getDimension(styleable.DLRoundMenuView_RMCoreMenuRoundRadius, defaultCoreMenuRoundRadius);
        this.mRoundMenuNumber = a.getInteger(styleable.DLRoundMenuView_RMRoundMenuNumber, defaultRoundMenuNumber);
        this.mRoundMenuDeviationDegree = (float)a.getInteger(styleable.DLRoundMenuView_RMRoundMenuDeviationDegree, defaultRoundMenuDeviationDegree);
        this.mIsDrawLineToCenter = a.getBoolean(styleable.DLRoundMenuView_RMIsDrawLineToCenter, defaultIsDrawLineToCenter);
        this.mRoundMenuNormalBackgroundColor = a.getColor(styleable.DLRoundMenuView_RMRoundMenuNormalBackgroundColor, defaultRoundMenuNormalBackgroundColor);
        this.mRoundMenuSelectedBackgroundColor = a.getColor(styleable.DLRoundMenuView_RMRoundMenuSelectedBackgroundColor, defaultRoundMenuSelectedBackgroundColor);
        this.mRoundMenuStrokeColor = a.getColor(styleable.DLRoundMenuView_RMRoundMenuStrokeColor, defaultRoundMenuStrokeColor);
        this.mRoundMenuStrokeSize = a.getDimension(styleable.DLRoundMenuView_RMRoundMenuStrokeSize, defaultRoundMenuStrokeSize);
        this.mRoundMenuDistance = a.getFraction(styleable.DLRoundMenuView_RMRoundMenuDistance, 1, 1, defaultRoundMenuDistance);
        Drawable drawable = a.getDrawable(styleable.DLRoundMenuView_RMCoreMenuDrawable);
        if (null == drawable) {
            drawable = defaultCoreMenuDrawable;
        }

        if (null != drawable) {
            this.mCoreMenuDrawable = DrawableUtils.drawableToBitmap(drawable);
        } else {
            this.mCoreMenuDrawable = null;
        }

        drawable = a.getDrawable(styleable.DLRoundMenuView_RMRoundMenuDrawable);
        if (null == drawable) {
            drawable = defaultRoundMenuDrawable;
        }

        Bitmap roundMenuDrawable;
        if (null != drawable) {
            roundMenuDrawable = DrawableUtils.drawableToBitmap(drawable);
        } else {
            roundMenuDrawable = null;
        }

        for(int i = 0; i < this.mRoundMenuNumber; ++i) {
            this.mRoundMenuDrawableList.add(i, roundMenuDrawable);
        }

        a.recycle();
    }

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int widthSpecSize = MeasureSpec.getSize(widthMeasureSpec);
        int heightSpecSize = MeasureSpec.getSize(heightMeasureSpec);
        this.setMeasuredDimension(widthSpecSize - 2, heightSpecSize - 2);
    }

    @SuppressLint({"DrawAllocation"})
    protected void onDraw(Canvas canvas) {
        this.mCoreX = (float)this.getWidth() / 2.0F;
        this.mCoreY = (float)this.getHeight() / 2.0F;
        RectF rect = new RectF(this.mRoundMenuStrokeSize, this.mRoundMenuStrokeSize, (float)this.getWidth() - this.mRoundMenuStrokeSize, (float)this.getHeight() - this.mRoundMenuStrokeSize);
        if (this.mRoundMenuNumber > 0) {
            float sweepAngle = 360.0F / (float)this.mRoundMenuNumber;
            float mRealRoundMenuDeviationDegree = this.mRoundMenuDeviationDegree - sweepAngle / 2.0F - 90.0F;

            for(int i = 0; i < this.mRoundMenuNumber; ++i) {
                Paint paint = new Paint();
                paint.setAntiAlias(true);
                paint.setColor(this.onClickState == i ? this.mRoundMenuSelectedBackgroundColor : this.mRoundMenuNormalBackgroundColor);
                canvas.drawArc(rect, mRealRoundMenuDeviationDegree + (float)i * sweepAngle, sweepAngle, true, paint);
                paint = new Paint();
                paint.setAntiAlias(true);
                paint.setStrokeWidth(this.mRoundMenuStrokeSize);
                paint.setStyle(Style.STROKE);
                paint.setColor(this.mRoundMenuStrokeColor);
                canvas.drawArc(rect, mRealRoundMenuDeviationDegree + (float)i * sweepAngle, sweepAngle, this.mIsDrawLineToCenter, paint);
                Bitmap roundMenuDrawable = (Bitmap)this.mRoundMenuDrawableList.get(i);
                if (null != roundMenuDrawable) {
                    Matrix matrix = new Matrix();
                    matrix.postTranslate(this.mCoreX + (float)(this.getWidth() / 2) * this.mRoundMenuDistance - (float)(roundMenuDrawable.getWidth() / 2), this.mCoreY - (float)roundMenuDrawable.getHeight() / 2.0F);
                    matrix.postRotate(this.mRoundMenuDeviationDegree - 90.0F + (float)i * sweepAngle, this.mCoreX, this.mCoreY);
                    canvas.drawBitmap(roundMenuDrawable, matrix, (Paint)null);
                }
            }
        }

        if (this.mHasCoreMenu) {
            RectF rect1 = new RectF(this.mCoreX - this.mCoreMenuRoundRadius, this.mCoreY - this.mCoreMenuRoundRadius, this.mCoreX + this.mCoreMenuRoundRadius, this.mCoreY + this.mCoreMenuRoundRadius);
            Paint paint = new Paint();
            paint.setAntiAlias(true);
            paint.setStrokeWidth(this.mCoreMenuStrokeSize);
            paint.setColor(this.onClickState == -1 ? this.mCoreMenuSelectedBackgroundColor : this.mCoreMenuNormalBackgroundColor);
            canvas.drawArc(rect1, 0.0F, 360.0F, true, paint);
            paint = new Paint();
            paint.setAntiAlias(true);
            paint.setStrokeWidth(this.mCoreMenuStrokeSize);
            paint.setStyle(Style.STROKE);
            paint.setColor(this.mCoreMenuStrokeColor);
            canvas.drawArc(rect1, 0.0F, 360.0F, true, paint);
            if (this.mCoreMenuDrawable != null) {
                canvas.drawBitmap(this.mCoreMenuDrawable, this.mCoreX - (float)this.mCoreMenuDrawable.getWidth() / 2.0F, this.mCoreY - (float)this.mCoreMenuDrawable.getHeight() / 2.0F, (Paint)null);
            }
        }

    }

    public boolean onTouchEvent(MotionEvent event) {
        switch(event.getAction()) {
            case 0:
                this.mTouchTime = (new Date()).getTime();
                float textX = event.getX();
                float textY = event.getY();
                double distance = DLMathUtils.getDistanceFromTwoSpot(this.mCoreX, this.mCoreY, textX, textY);
                if (distance <= (double)this.mCoreMenuRoundRadius) {
                    this.onClickState = -1;
                } else if (distance <= (double)(this.getWidth() / 2)) {
                    float sweepAngle = 360.0F / (float)this.mRoundMenuNumber;
                    double angle = DLMathUtils.getRotationBetweenLines(this.mCoreX, this.mCoreY, textX, textY);
                    angle = (angle + 360.0D + (double)(sweepAngle / 2.0F) - (double)((int)this.mRoundMenuDeviationDegree)) % 360.0D;
                    this.onClickState = (int)(angle / (double)sweepAngle);
                    if (this.onClickState >= this.mRoundMenuNumber) {
                        this.onClickState = 0;
                    }
                } else {
                    this.onClickState = -2;
                }

                this.mHandler.sendEmptyMessageDelayed(1, (long)this.DL_DEFAULT_LONG_CLICK_TIME);
                this.invalidate();
                break;
            case 1:
                this.mHandler.removeMessages(1);
                if ((new Date()).getTime() - this.mTouchTime < (long)this.DL_DEFAULT_LONG_CLICK_TIME && this.mMenuClickListener != null) {
                    this.mMenuClickListener.OnMenuClick(this.onClickState);
                }

                this.onClickState = -2;
                this.invalidate();
            case 2:
            default:
                break;
            case 3:
            case 4:
                this.mHandler.removeMessages(1);
                this.onClickState = -2;
                this.invalidate();
        }

        this.mTouchListener.OnTouch(event);
        return true;
    }

    public void setOnMenuClickListener(OnMenuClickListener onMenuClickListener) {
        this.mMenuClickListener = onMenuClickListener;
    }

    public void setOnMenuLongClickListener(OnMenuLongClickListener onMenuLongClickListener) {
        this.mMenuLongClickListener = onMenuLongClickListener;
    }

    public void setOnMenuTouchListener(OnMenuTouchListener onMenuTouchListener) {
        this.mTouchListener = onMenuTouchListener;
    }

    public void setLongClickTime(int millisecond) {
        this.DL_DEFAULT_LONG_CLICK_TIME = millisecond;
        this.invalidate();
    }

    public void setHasCoreMenu(boolean hasCoreMenu) {
        this.mHasCoreMenu = hasCoreMenu;
        this.invalidate();
    }

    public void setCoreMenuNormalBackgroundColor(int color) {
        this.mCoreMenuNormalBackgroundColor = color;
        this.invalidate();
    }

    public void setCoreMenuSelectedBackgroundColor(int color) {
        this.mCoreMenuSelectedBackgroundColor = color;
        this.invalidate();
    }

    public void setCoreMenuStrokeColor(int color) {
        this.mCoreMenuStrokeColor = color;
        this.invalidate();
    }

    public void setCoreMenuStrokeSize(float size) {
        this.mCoreMenuStrokeSize = size;
        this.invalidate();
    }

    public void setCoreMenuRoundRadius(float radius) {
        this.mCoreMenuRoundRadius = radius;
        this.invalidate();
    }

    public void setCoreMenuDrawable(Drawable drawable) {
        this.mCoreMenuDrawable = DrawableUtils.drawableToBitmap(drawable);
        this.invalidate();
    }

    public void setRoundMenuNumber(int number) {
        this.mRoundMenuNumber = number;
        this.invalidate();
    }

    public void setRoundMenuDeviationDegree(float degree) {
        this.mRoundMenuDeviationDegree = degree;
        this.invalidate();
    }

    public void setRoundMenuDrawable(int index, Drawable drawable) {
        if (index >= 0 && index <= this.mRoundMenuNumber) {
            Bitmap bitmap = DrawableUtils.drawableToBitmap(drawable);
            this.mRoundMenuDrawableList.set(index, bitmap);
            this.invalidate();
        }
    }

    public void setRoundMenuNormalBackgroundColor(int color) {
        this.mRoundMenuNormalBackgroundColor = color;
        this.invalidate();
    }

    public void setRoundMenuSelectedBackgroundColor(int color) {
        this.mRoundMenuSelectedBackgroundColor = color;
        this.invalidate();
    }

    public void setRoundMenuStrokeColor(int color) {
        this.mRoundMenuStrokeColor = color;
        this.invalidate();
    }

    public void setRoundMenuStrokeSize(float size) {
        this.mRoundMenuStrokeSize = size;
        this.invalidate();
    }

    public void setRoundMenuDistance(float distance) {
        if (distance <= 1.0F) {
            this.mRoundMenuDistance = distance;
            this.invalidate();
        }
    }

    public void setIsDrawLineToCenter(boolean is) {
        this.mIsDrawLineToCenter = is;
        this.invalidate();
    }
}
