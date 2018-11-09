package com.wayne.user.annotation;

import java.lang.annotation.*;

/**
 * @author Wayne
 * @date 2018/11/7
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Action {

    String actionId(); // 接口id, 如1001

    boolean validToken() default false; // 是否校验token

    Class<?> bizClass() default Object.class; // body需要转换的实体类

}
