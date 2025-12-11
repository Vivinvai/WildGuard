"""
Pre-download MobileNetV2 weights to avoid interruption during service startup
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Reduce TF logging

print("🔄 Downloading MobileNetV2 weights...")
print("This is a one-time download (~14 MB)")

try:
    from tf_keras.applications import MobileNetV2
    
    # This will download the weights if not present
    model = MobileNetV2(weights='imagenet')
    print("✅ MobileNetV2 weights downloaded successfully!")
    print(f"   Model has {len(model.layers)} layers")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    
except Exception as e:
    print(f"❌ Error downloading MobileNetV2: {e}")
    import traceback
    traceback.print_exc()
