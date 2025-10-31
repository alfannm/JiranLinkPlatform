package com.aidea.jiranlink;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.PluginMethod;

import com.huawei.hms.support.hwid.HuaweiIdAuthManager;
import com.huawei.hms.support.hwid.request.HuaweiIdAuthParams;
import com.huawei.hms.support.hwid.service.HuaweiIdAuthService;

@CapacitorPlugin(name = "HuaweiAuth")
public class HuaweiAuthPlugin extends Plugin {

    @PluginMethod
    public void signIn(PluginCall call) {
        HuaweiIdAuthParams authParams = new HuaweiIdAuthParams.Builder(HuaweiIdAuthParams.DEFAULT_AUTH_REQUEST_PARAM)
                .setIdToken()
                .setAccessToken()
                .createParams();
        HuaweiIdAuthService service = HuaweiIdAuthManager.getService(getContext(), authParams);
        getActivity().startActivityForResult(service.getSignInIntent(), 8888);
        call.resolve();
    }
}
