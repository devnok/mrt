package com.mrt.service;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class LocationService extends HeadlessJsTaskService {
    public static final String TASK_NAME = "LogLocationService";

    public static void startService(@NonNull Context context) {
        Intent intentService = new Intent(context, LocationService.class);
        context.startService(intentService);
    }
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    TASK_NAME,
                    Arguments.fromBundle(extras),
                    5000, // timeout for the task
                    true // optional: defines whether or not  the task is allowed in foreground. Default is false
            );
        }
        return null;
    }
}
