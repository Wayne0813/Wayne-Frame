package com.wayne.user.config;

import com.alibaba.fastjson.JSONObject;
import com.wayne.dto.RequestForm;
import com.wayne.exception.RRException;
import com.wayne.user.annotation.RequestParamHandler;
import com.wayne.util.ValidatorUtils;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * 处理统一请求的参数解析
 * @author Wayne
 * @date 2018/11/6
 */
@Component
public class RequestFormHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    /**
     * 指定要针对的参数类型和注解
     * @param parameter 方法参数
     * @return 判断是否有指定的参数和注解
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().isAssignableFrom(RequestForm.class) && parameter.hasParameterAnnotation(RequestParamHandler.class);
    }

    /**
     * 处理参数
     */
    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) throws Exception {
        Object request = nativeWebRequest.getAttribute("request", RequestAttributes.SCOPE_REQUEST);
        if (request == null) {
            throw new RRException("请求参数为空, 处理失败", -1);
        }
        String enCode = (String) request;
        //TODO 使用私钥解密

        String param = enCode;

        RequestForm form;
        try {

            form = JSONObject.parseObject(param, RequestForm.class);
        } catch (Exception e) {
            throw new RRException("请求参数格式不正确", 500);
        }

        //验证参数
        ValidatorUtils.validateEntity(form.getHeader());
        return form;
    }
}
