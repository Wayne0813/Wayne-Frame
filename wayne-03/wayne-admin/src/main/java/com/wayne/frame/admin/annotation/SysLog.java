package com.wayne.frame.admin.annotation;

import com.wayne.frame.admin.resource.SystemModuleEnum;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {

    /**
     * 系统操作描述
     * @return 字符串
     */
    String message();

    /**
     * 系统模块
     * @return 模块名称 + 编号
     */
    SystemModuleEnum module();
}
