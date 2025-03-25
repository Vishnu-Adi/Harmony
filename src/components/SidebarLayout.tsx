import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Sidebar from './Sidebar';

const { width } = Dimensions.get('window');

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? -width * 0.75 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={styles.container}>
      <Sidebar 
        isVisible={isSidebarVisible}
        onClose={toggleSidebar}
        slideAnim={slideAnim}
      />
      {React.cloneElement(children as React.ReactElement, { toggleSidebar })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
