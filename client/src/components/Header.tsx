import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fontSize } from '../utils/color';
import VectorIcon from './common/VectorIcon';
const Header = () => {
    const { theme , toggleTheme} = useTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
                style={{
                    color: theme.text,
                    fontSize: fontSize.title,
                    fontFamily: 'Poppins-Bold',
                }}
            >
                Tweet
            </Text>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
            }}>
                   <TouchableOpacity onPress={toggleTheme} hitSlop={10} >
                    <VectorIcon type="Feather" name="search" color={theme.text} size={20} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} >
                    <VectorIcon type="Feather" name="search" color={theme.text} size={20} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10}>
                    <VectorIcon type="Feather" name="camera" color={theme.text} size={20} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10}>
                    <VectorIcon type="Feather" name="edit" color={theme.text} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;
