package com.wayne.frame.admin.resource;

public enum SystemModuleEnum {

    LOGIN(1001, "登录"),
    CHANGE_PSW(1002, "修改密码"),
    LOGOUT(1003, "退出登录"),
    DICTIONARY(1004, "数据字典"),
    BULLETIN(1005, "系统公告"),
    SCHEDULE(1006, "定时任务"),
    SMS_CONFIG(1007, "短信配置"),
    EMAIL_CONFIG(1008, "短信发送服务"),
    SMS_SEND(1009, "短信发送服务"),
    EMAIL_SEND(1010, "邮件发送服务"),
    WORKFLOW_CONFIG(1011, "工作流配置");


    private int modelNo;
    private String modelName;

    SystemModuleEnum(int modelNo, String modelName) {
        this.modelNo = modelNo;
        this.modelName = modelName;
    }
}
