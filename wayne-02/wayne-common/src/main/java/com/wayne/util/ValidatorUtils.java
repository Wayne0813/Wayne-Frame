package com.wayne.util;

import com.alibaba.fastjson.JSONObject;
import com.wayne.exception.RRException;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.util.Set;

/**
 * hibernate-validator校验工具类
 * @author Wayne
 * @date 2018/11/6
 */
public class ValidatorUtils {

    private static Validator validator;

    static {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    public static void validateEntity(Object object, Class<?>... groups) {
        //先验证值是否为空
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object, groups);
        if (!constraintViolations.isEmpty()) {
            JSONObject jsonObject = new JSONObject();
            int i = 0;
            for (ConstraintViolation<Object> constraint : constraintViolations) {
                jsonObject.put("error" + (i + 1), constraint.getMessage());
                i++;
            }
            throw new RRException(jsonObject.toJSONString(), -1);
        }
    }

}
