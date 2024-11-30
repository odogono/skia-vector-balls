import { useState } from 'react';
import { StyleSheet } from 'react-native';

import {
  Group,
  SkMatrix,
  Skia,
  Canvas as SkiaCanvas
} from '@shopify/react-native-skia';

export type CanvasProps = React.PropsWithChildren<object>;

export const Canvas = ({ children }: CanvasProps) => {
  const [viewMatrix, setViewMatrix] = useState<SkMatrix>();

  return (
    <SkiaCanvas
      style={styles.canvas}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        const m = Skia.Matrix();
        m.translate(width / 2, height / 2);
        setViewMatrix(m);
      }}
    >
      <Group matrix={viewMatrix}>{children}</Group>
    </SkiaCanvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%'
  }
});
