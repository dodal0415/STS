import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, size = 100 }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <QRCode
        value={value}
        size={size}
      />
    </View>
  );
};

export default QRCodeGenerator;