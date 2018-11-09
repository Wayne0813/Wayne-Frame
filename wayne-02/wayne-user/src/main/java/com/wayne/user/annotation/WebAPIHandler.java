package com.wayne.user.annotation;

import java.lang.annotation.*;

/**
 * @author Wayne
 * @date 2018/11/6
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WebAPIHandler {
}
