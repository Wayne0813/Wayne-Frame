package com.wayne.user.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.wayne.dto.RequestForm;
import com.wayne.exception.RRException;
import com.wayne.user.annotation.Action;
import com.wayne.user.controller.GlobalController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 根据参数解析需要执行的方法并调用
 * @author Wayne
 * @date 2018/11/7
 */
@Component
public class RequestExecuteChainResolver {


    public Object resolve(RequestForm form, GlobalController controller) {
        Method target = null;
        // 取得所有的方法
        Method[] methods = controller.getClass().getMethods();
        for(Method method : methods) {
            // 判断方法上是否有@Action注解
            Action action = method.getAnnotation(Action.class);
            if(action == null) {
                continue;
            }
            // 根据ActionId判断要调用哪个接口
            if(form.getHeader().getAction().equals(action.actionId())) {
                target = method;
                break;
            }
        }

        if(target == null) {
            throw new RRException("请求接口不存在, action: " + form.getHeader().getAction(), 404);
        }

        Action action = target.getAnnotation(Action.class);
        if(action.validToken()) {
            // 必须验证token
            String token = form.getHeader().getToken();

            if(StringUtils.isBlank(token)) {
                throw new RRException("token已失效或已过期!", 401);
            }

            // jwt校验token

            // 从token中取出用户

            // 将用户信息放入form中

        } else {
            // 非必须验证token
            String token = form.getHeader().getToken();

            if(StringUtils.isNotBlank(token)) {
                // jwt校验token

                // 从token中取出用户

                // 将用户信息放入form中

            }
        }

        // 转换Json数据为Java类
        try {
            // 表体
            Object o = form.getBody();
            // com.alibaba.fastjson.JSONObject
            if("com.alibaba.fastjson.JSONObject".equals(o.getClass().getName())) {
                // 前端传输为Json格式的对象
                JSONObject body = (JSONObject) o;
                if(!"java.lang.Object".equals(action.bizClass().getName())) {
                    // 前段要求转换为对象
                    form.setBody(body.toJavaObject(action.bizClass()));
                } else {
                    // 不要求转换成实体
                    form.setBody(body);
                }
            // com.alibaba.fastjson.JSONObject
            } else if("com.alibaba.fastjson.JSONArray".equals(o.getClass().getName())) {
                // 前端传输为Json格式的集合
                JSONArray body = (JSONArray) o;
                if(!"java.lang.Object".equals(action.bizClass().getName())) {
                    // 前段要求转换为对象
                    form.setBody(body.toJavaObject(action.bizClass()));
                } else {
                    // 不要求转换成实体
                    form.setBody(body);
                }
            } else {
                //默认是一个字符串形式
                JSONObject jsonObject = JSON.parseObject((String) o);

                if(!"java.lang.Object".equals(action.bizClass().getName())) {
                    // 前段要求转换为对象
                    form.setBody(jsonObject.toJavaObject(action.bizClass()));
                } else {
                    // 不要求转换成实体
                    form.setBody(jsonObject);
                }
            }

            return target.invoke(controller, form);

        } catch (IllegalAccessException | InvocationTargetException e) {
            String message = "";
            if (e instanceof InvocationTargetException) {
                message = ((InvocationTargetException) e).getTargetException().getMessage();
            } else {
                message = ((IllegalAccessException) e).getMessage();
            }
            throw new RRException("接口调用失败，action=" + form.getHeader().getAction() + "，exception=" + message);
        }
    }
}
