#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>

@interface AppDelegate () <RCTBridgeDelegate>

@end

@implementation AppDelegate

- (void)awakeFromNib {
  [super awakeFromNib];

  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
  NSStoryboard *storyboard = [NSStoryboard storyboardWithName:@"Main" bundle:nil];
  NSViewController *rootViewController = [storyboard instantiateControllerWithIdentifier:@"root"];
  
  _popover = [[NSPopover alloc] init];
  [_popover setContentSize:NSMakeSize(800, 600)];
  [_popover setAnimates:YES];
  [_popover setBehavior:NSPopoverBehaviorTransient];
  [_popover setContentViewController:rootViewController];
  
  _statusBarItem = [[NSStatusBar systemStatusBar] statusItemWithLength:60.];
  
  if (_statusBarItem.button != nil) {
    [_statusBarItem.button setAction:@selector(togglePopover:)];
    [_statusBarItem.button setTitle:@"GIPHY"];
  }
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
  // Insert code here to tear down your application
}

#pragma mark - RCTBridgeDelegate Methods

- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge {
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:@"main"]; // .jsbundle;
}

- (IBAction)togglePopover:(id)sender {
  if (_statusBarItem.button != nil) {
    if (_popover.isShown) {
      [_popover performClose:sender];
    } else {
      [_popover showRelativeToRect:_statusBarItem.button.bounds ofView:_statusBarItem.button preferredEdge:NSRectEdgeMinY];
      [_popover.contentViewController.view.window becomeKeyWindow];
    }
  }
}

@end
