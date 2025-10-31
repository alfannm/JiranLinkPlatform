package com.aidea.jiranlink;

import com.getcapacitor.BridgeActivity;
import com.aidea.jiranlink.HuaweiAuthPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(HuaweiAuthPlugin.class);
    }
}