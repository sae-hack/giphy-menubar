#import <Cocoa/Cocoa.h>

@class RCTBridge;

@interface AppDelegate : NSObject <NSApplicationDelegate>

@property (nonatomic, readonly) RCTBridge *bridge;
@property (nonatomic, readonly) NSStatusItem *statusBarItem;
@property (nonatomic, readonly) NSPopover *popover;

@end
