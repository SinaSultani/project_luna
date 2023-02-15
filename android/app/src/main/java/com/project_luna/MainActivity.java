package com.project_luna;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "project_luna";
  }

  //To avoid crashed caused by react-native-screens
  @Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
}
