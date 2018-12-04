package com.wayne.frame.admin.controller;

import com.wayne.frame.admin.common.form.AdminLoginForm;
import com.wayne.frame.admin.service.AdminLoginService;
import com.wayne.frame.common.dto.ResponsBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wayne
 * @date 2018/12/3
 */
@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AdminLoginService adminLoginService;

    // 跳转登录页面
    @GetMapping("/login.html")
    public String loginPage() {
        return "login";
    }

    // 用户登录
    @PostMapping("/login.do")
    @ResponseBody
    public ResponsBean login(@RequestBody AdminLoginForm form) {
        return adminLoginService.login(form);
    }


}
