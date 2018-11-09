package com.wayne.user.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * 接口请求拦截器
 * @author Wayne
 * @date 2018/11/7
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private UserRequestInterceptor userRequestInterceptor;

    @Autowired
    private RequestFormHandlerMethodArgumentResolver requestFormHandlerMethodArgumentResolver;

    // 添加拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userRequestInterceptor).addPathPatterns("/user/v1/**");
        System.out.println("已添加拦截器, 拦截请求: /user/v1/**");
    }

    // 添加参数处理器
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(requestFormHandlerMethodArgumentResolver);
    }
}
