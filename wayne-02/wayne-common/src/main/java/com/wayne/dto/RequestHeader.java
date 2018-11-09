package com.wayne.dto;


import java.util.Date;

/**
 * @author Wayne
 * @date 2018/11/6
 */
public class RequestHeader {

    // 请求平台：app、web
    // @NotBlank(message = "客户端名称不可为空")
    private String plateForm;

    // 请求的版本：v1
    // @NotBlank(message = "版本号不可为空")
    private String version;

    // token
    private String token;

    // 用户对象
    //private User user;

    // 请求时间:yyyy-MM-dd HH:mm:ss
    // @javax.validation.constraints.NotNull(message = "请求时间不可为空")
    private Date requestTime;

    // 请求格式：content-type,如：application/json
    // @javax.validation.constraints.NotNull(message = "请求格式不可为空")
    private String contentType;

    // 加密类型：RSA
    // @javax.validation.constraints.NotNull(message = "加密类型不可为空")
    private String encryp = "RSA";

    // 请求方法编号
    // @javax.validation.constraints.NotNull(message = "接口编号不可为空")
    private String action;

    public String getPlateForm() {
        return plateForm;
    }

    public void setPlateForm(String plateForm) {
        this.plateForm = plateForm;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Date requestTime) {
        this.requestTime = requestTime;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getEncryp() {
        return encryp;
    }

    public void setEncryp(String encryp) {
        this.encryp = encryp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    @Override
    public String toString() {
        return "RequestHeader{" +
                "plateForm='" + plateForm + '\'' +
                ", version='" + version + '\'' +
                ", token='" + token + '\'' +
                ", requestTime=" + requestTime +
                ", contentType='" + contentType + '\'' +
                ", encryp='" + encryp + '\'' +
                ", action='" + action + '\'' +
                '}';
    }
}
