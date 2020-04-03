/**
 * Automatically binds any method to the current object with which it is called
 * @param target
 * @param propertyName
 * @param desc
 */
export default function AutoBind(_: any, _2: string, desc: TypedPropertyDescriptor<any>) {
  // Step 1: Get the original value
  const originalMethod = desc.value;

  // Step 2: Set the adjusted descriptor
  const adjustedDescriptor : TypedPropertyDescriptor<any> = {
    get() {
      return originalMethod.bind(this);
    },
  };

  // Step 3: Return the adjusted descriptor
  return adjustedDescriptor;
}
