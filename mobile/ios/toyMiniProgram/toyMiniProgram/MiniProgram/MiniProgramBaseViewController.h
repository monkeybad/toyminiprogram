//
//  MiniProgramBaseViewController.h
//  toyMiniProgram
//
//  Created by LeeJustin on 2019/3/15.
//  Copyright © 2019年 monkeybad. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

// 基类
@interface MiniProgramBaseViewController : UIViewController <WKNavigationDelegate,WKUIDelegate>

@property (nonatomic, strong) WKWebView* webviewUIView; // UI窗口
@property (nonatomic, strong) UIButton* buttonClose; // 关闭按钮

@property (nonatomic, strong) NSString* logicURL;
@property (nonatomic, strong) NSString* uiURL;

- (void)loadPage;
- (void)closePage;

- (instancetype)initWithLogicURL:(NSString*)logicURL UIURL:(NSString*)uiURL;

@end

NS_ASSUME_NONNULL_END
