//
//  ViewController.m
//  toyMiniProgram
//
//  Created by LeeJustin on 2019/3/15.
//  Copyright © 2019年 monkeybad. All rights reserved.
//

#import "ViewController.h"
#import "MiniProgramDebugViewController.h"

@interface ViewController () <UITextFieldDelegate>

@property (nonatomic,strong) UILabel* labelInputIP;  // IP输入框标题
@property (nonatomic,strong) UITextField* inputFieldIP;  // IP输入框
@property (nonatomic,strong) UIButton* buttonStartDebug;  // 调试开始按钮

@end

@implementation ViewController

#pragma mark UIViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    CGRect rect = CGRectZero;
    
    // labelInputIP
    rect = CGRectMake(0, 100, self.view.frame.size.width, 50);
    self.labelInputIP = [[UILabel alloc] initWithFrame:rect];
    self.labelInputIP.textColor = [UIColor darkGrayColor];
    self.labelInputIP.textAlignment = NSTextAlignmentCenter;
    self.labelInputIP.font = [UIFont systemFontOfSize:20];
    self.labelInputIP.text = @"请输入调试工具的URL";
    [self.view addSubview:_labelInputIP];
    
    // iputFieldIP
    rect = CGRectMake(40, CGRectGetMaxY(rect) + 20, self.view.frame.size.width - 80, 50);
    self.inputFieldIP = [[UITextField alloc] initWithFrame:rect];
    self.inputFieldIP.textAlignment = NSTextAlignmentCenter;
    self.inputFieldIP.layer.masksToBounds = YES;
    self.inputFieldIP.layer.cornerRadius = 2.0;
    self.inputFieldIP.layer.borderColor = [UIColor darkGrayColor].CGColor;
    self.inputFieldIP.layer.borderWidth = 1.0;
    [self.view addSubview:_inputFieldIP];
    _inputFieldIP.text = @"ws://X.X.X.X:8001/";
    _inputFieldIP.delegate = self;
    
    // buttonStartDebug
    rect = CGRectMake(80, CGRectGetMaxY(rect) + 20, self.view.frame.size.width - 160, 50);
    self.buttonStartDebug = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.buttonStartDebug addTarget:self action:@selector(_onClickedStartDebugBtn:) forControlEvents:UIControlEventTouchUpInside];
    self.buttonStartDebug.frame = rect;
    self.buttonStartDebug.layer.masksToBounds = YES;
    self.buttonStartDebug.layer.cornerRadius = rect.size.height/2.0;
    self.buttonStartDebug.backgroundColor = [UIColor greenColor];
    [self.buttonStartDebug setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.buttonStartDebug setTitleColor:[UIColor lightGrayColor] forState:UIControlStateHighlighted];
    [self.buttonStartDebug setTitle:@"开始调试" forState:UIControlStateNormal];
    [self.view addSubview:_buttonStartDebug];
}

#pragma mark <UITextFieldDelegate>

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

#pragma mark Private

- (nullable NSString *)stringByAddingPercentEncodingForRFC3986:(NSString*)srcString {
    NSString *unreserved = @"-._~?";
    NSMutableCharacterSet *allowed = [NSMutableCharacterSet alphanumericCharacterSet];
    [allowed addCharactersInString:unreserved];
    return [srcString stringByAddingPercentEncodingWithAllowedCharacters: allowed];
}

- (void)_onClickedStartDebugBtn:(id)sender
{
    NSString* serverURL = self.inputFieldIP.text;
    serverURL = [self stringByAddingPercentEncodingForRFC3986:serverURL];
    NSString* uiURL = [@"file://" stringByAppendingString:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"view_mobile.html"]];
    uiURL = [uiURL stringByAppendingFormat:@"?wsmsgsvr=%@",serverURL];
    MiniProgramDebugViewController* dbgController = [[MiniProgramDebugViewController alloc] initWithLogicURL:@"" UIURL:uiURL];
    // wkwebview必须得在controller present之后才能加载，否则加载不了网页，是一个比较严重的bug
    [self presentViewController:dbgController animated:YES completion:^(){
       [dbgController loadPage];
    }];
}

@end
