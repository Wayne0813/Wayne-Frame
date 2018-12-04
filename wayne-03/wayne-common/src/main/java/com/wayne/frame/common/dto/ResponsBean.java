package com.wayne.frame.common.dto;

/**
 * 全局自定义返回结果
 * @author Wayne
 * @date 2018/12/3
 */
public class ResponsBean {

    private boolean success = true;
    private int code;
    private String message;
    private Object data;

    public static ResponsBean createInstance() {
        return createInstance(true);
    }
    public static ResponsBean createInstance(String message) {
        return createInstance(true, 200, message);
    }
    public static ResponsBean createInstance(Object data) {
        return createInstance(true, 200,"处理成功!", data);
    }
    public static ResponsBean createInstance(boolean success) {
        return createInstance(success, success ? 200 : 500);
    }
    public static ResponsBean createInstance(boolean success, int code) {
        return createInstance(success, code, "");
    }
    public static ResponsBean createInstance(boolean success, int code, String message) {
        return createInstance(success, code, message, null);
    }
    public static ResponsBean createInstance(boolean success, int code, String message, Object data) {
        ResponsBean responsBean = new ResponsBean();
        responsBean.setSeccess(success);
        responsBean.setCode(code);
        responsBean.setMessage(message);
        responsBean.setData(data);
        return responsBean;
    }

    public boolean isSeccess() {
        return success;
    }

    public void setSeccess(boolean success) {
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
