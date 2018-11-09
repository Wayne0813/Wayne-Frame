package com.wayne.user.config;

import com.wayne.exception.RRException;
import com.wayne.user.annotation.WebAPIHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户接口请求的资源API拦截器
 * @author Wayne
 * @date 2018/11/6
 */
@Component
public class UserRequestInterceptor extends HandlerInterceptorAdapter {

    /**
     * 预处理
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //检查请求的资源上有没有@WebAPIHandler注解，如果有，则继续解析，如果没有，则禁止访问
        WebAPIHandler annotation;
        if(handler instanceof HandlerMethod) {
            annotation = ((HandlerMethod) handler).getMethodAnnotation(WebAPIHandler.class);
        } else {
            return true;
        }
        if(annotation == null) {
            throw new RRException("权限不足, 请联系管理员!", -1);
        }

        //取出请求的参数并交给参数处理器执行
        request.setAttribute("request", request.getParameter("request"));
        return true;
    }

    /**
     * 后处理
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }

    /**
     * 返回处理
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        super.afterCompletion(request, response, handler, ex);
    }


}
