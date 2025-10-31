interface USBDevice {
  productName?: string;
  manufacturerName?: string;
  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferOut(
    endpointNumber: number,
    data: BufferSource
  ): Promise<USBOutTransferResult>;
  configuration?: any;
}

interface USBOutTransferResult {
  status: string;
  bytesWritten?: number;
}

interface USB {
  requestDevice(options?: {
    filters: { vendorId?: number }[];
  }): Promise<USBDevice>;
}

interface Navigator {
  usb: USB;
}
