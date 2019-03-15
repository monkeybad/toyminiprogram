//
//  MiniProgramBaseViewController.m
//  toyMiniProgram
//
//  Created by LeeJustin on 2019/3/15.
//  Copyright © 2019年 monkeybad. All rights reserved.
//

#import "MiniProgramBaseViewController.h"

@interface MiniProgramBaseViewController ()

@end

@implementation MiniProgramBaseViewController

#pragma mark MiniProgramBaseViewController interface

- (void)loadPage
{
    NSString* baseURL = _uiURL;
    NSString* paramStr = @"";
    NSRange rangeMark = [_uiURL rangeOfString:@"?"];
    if (rangeMark.length > 0)
    {
        baseURL = [_uiURL substringToIndex:rangeMark.location];
        paramStr = [_uiURL substringFromIndex:rangeMark.location];
    }
    NSURLRequest* uiReq = nil;
    if ([paramStr length] > 0)
    {
        uiReq = [NSURLRequest requestWithURL:[NSURL URLWithString:paramStr relativeToURL:[NSURL URLWithString:baseURL]]];
    }
    else
    {
        uiReq = [NSURLRequest requestWithURL:[NSURL URLWithString:baseURL]];
    }
    [self.webviewUIView loadRequest:uiReq];
}

- (void)closePage
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (instancetype)initWithLogicURL:(NSString*)logicURL UIURL:(NSString*)uiURL
{
    self = [super init];
    if (self) {
        self.logicURL = logicURL;
        self.uiURL = uiURL;
    }
    return self;
}

#pragma mark UIViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    CGRect rect = CGRectZero;
    
    // webviewUIView
    rect = self.view.frame;
    rect.origin = CGPointZero;
    WKWebViewConfiguration* cfg = [[WKWebViewConfiguration alloc] init];
    self.webviewUIView = [[WKWebView alloc] initWithFrame:rect configuration:cfg];
    self.webviewUIView.navigationDelegate = self;
    self.webviewUIView.UIDelegate = self;
    self.webviewUIView.scrollView.delegate = self;
    [self.view addSubview:_webviewUIView];
    
    // buttonClose
    rect = CGRectMake(self.view.frame.size.width - 80, 50, 40, 40);
    self.buttonClose = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.buttonClose addTarget:self action:@selector(_onClickedCloseBtn:) forControlEvents:UIControlEventTouchUpInside];
    self.buttonClose.frame = rect;
    self.buttonClose.layer.masksToBounds = YES;
    self.buttonClose.layer.cornerRadius = rect.size.height/2.0;
    self.buttonClose.backgroundColor = [[UIColor whiteColor] colorWithAlphaComponent:0.5];
    [self.buttonClose setTitle:@"X" forState:UIControlStateNormal];
    [self.buttonClose setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [self.buttonClose setTitleColor:[UIColor lightGrayColor] forState:UIControlStateHighlighted];
    [self.view addSubview:_buttonClose];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

#pragma mark <UIScrollViewDelegate>

- (nullable UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
{
    // 禁止缩放
    return nil;
}

#pragma mark <WKNavigationDelegate>
-(void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    //如果是跳转一个新页面
    if (navigationAction.targetFrame == nil) {
        [webView loadRequest:navigationAction.request];
    }
    NSString* newURL = [navigationAction.request.URL absoluteString];
    if ([newURL isEqualToString:@"native://closed"])
    {
        // 关闭页面命令
        [self closePage];
    }
    
    decisionHandler(WKNavigationActionPolicyAllow);
}

#pragma mark Private
- (void)_onClickedCloseBtn:(id)sender
{
    [self closePage];
}
@end
