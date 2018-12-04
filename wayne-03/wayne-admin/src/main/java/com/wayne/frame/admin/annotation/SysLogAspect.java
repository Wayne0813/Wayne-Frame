package com.wayne.frame.admin.annotation;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;

import java.lang.reflect.Method;

/**
 * @author Wayne
 * @date 2018/12/4
 */
@Aspect
public class SysLogAspect {

    @Pointcut("@annotation(com.wayne.frame.admin.annotation.SysLog)")
    public void logPointCut() {}

    @Around("logPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        Object result = point.proceed();
        long endTime = System.currentTimeMillis();
        // 执行方法消耗时间
        long time = endTime - beginTime;

        return result;
    }

    private void saveSysLog(ProceedingJoinPoint point, long time) {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();

        SysLog sysLog = method.getAnnotation(SysLog.class);

        if(sysLog != null) {

        }

    }

}
