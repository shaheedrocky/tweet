import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USER } from '../../data/index';
import UserItem from '../../components/UserItem';
import { fontSize } from '../../utils/color';

const Chat = () => {
    const { theme, } = useTheme();

    const ListHeaderComponent = () => {
        return (
            <View style={{ padding: 16 }}>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: fontSize.heading }}>Message</Text>
            </View>
        )
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}
        >
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
                ListHeaderComponent={<ListHeaderComponent />}
                showsVerticalScrollIndicator={false}
                data={USER}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <UserItem item={item} />}
                ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 0.4, marginBottom: 2, borderColor: '#CDCDCD', marginHorizontal: -16 }} />}
            />
        </SafeAreaView>
    );
};

export default Chat;
