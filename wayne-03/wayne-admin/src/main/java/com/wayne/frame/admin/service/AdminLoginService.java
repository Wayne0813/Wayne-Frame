package com.wayne.frame.admin.service;

import com.wayne.frame.admin.common.form.AdminLoginForm;
import com.wayne.frame.common.dto.ResponsBean;

/**
 * @author Wayne
 * @date 2018/12/3
 */
public interface AdminLoginService {

    /**
     * 登录
     * @param form 登录参数
     * @return 登录结果
     */
    ResponsBean login(AdminLoginForm form);

}
