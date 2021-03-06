package com.posterific;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.CallbackManager;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {

      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAccountKitPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNViewShotPackage(),
          new PickerPackage()
        );
      }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
      super.onCreate();
      FacebookSdk.sdkInitialize(getApplicationContext());
  }

  protected static CallbackManager getCallbackManager () {
    return mCallbackManager;
  }
}
