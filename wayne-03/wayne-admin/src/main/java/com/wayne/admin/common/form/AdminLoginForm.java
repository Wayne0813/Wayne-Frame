package com.wayne.admin.common.form;

import javax.validation.constraints.NotBlank;

/**
 * @author Wayne
 * @date 2018/12/3
 */
public class AdminLoginForm {

    @NotBlank(message = "用户名不能为空")
    private String username;
    @NotBlank(message = "密码不能为空")
    private String password;
    @NotBlank(message = "验证码不能为空")
    private String vercode;

    private String remember;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVercode() {
        return vercode;
    }

    public void setVercode(String vercode) {
        this.vercode = vercode;
    }

    public String getRemember() {
        return remember;
    }

    public void setRemember(String remember) {
        this.remember = remember;
    }

    @Override
    public String toString() {
        return "AdminLoginForm{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", vercode='" + vercode + '\'' +
                ", remember='" + remember + '\'' +
                '}';
    }
}
