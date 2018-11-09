package com.wayne.user.controller;

import com.wayne.dto.RequestForm;
import com.wayne.user.annotation.Action;
import com.wayne.user.annotation.RequestParamHandler;
import com.wayne.user.annotation.WebAPIHandler;
import com.wayne.user.config.RequestExecuteChainResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Wayne
 * @date 2018/11/6
 */
@RestController
@RequestMapping("/user")
public class GlobalController {

    @Autowired
    private RequestExecuteChainResolver requestExecuteChainResolver;


    @RequestMapping("/v1")
    @WebAPIHandler
    public Object resolverRequest(@RequestParamHandler RequestForm form) {
        System.out.println("进入方法内、、、");
        return requestExecuteChainResolver.resolve(form, this);
    }

    @Action(actionId = "1001")
    public String getTest(RequestForm form) {
        return "hello";
    }

}
