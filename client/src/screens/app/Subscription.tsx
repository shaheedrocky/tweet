import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import { HEIGHT } from '../../utils/color';
import { useTheme } from '../../providers/ThemeProvider';
import VectorIcon from '../../components/common/VectorIcon';

const benefits = [
  'Verified Premium Badge',
  'Unlimited Likes',
  'Priority Profile Visibility',
  'Ad-Free Experience',
  'Advanced Analytics',
  'Exclusive Premium Themes',
];

const Subscription = () => {
  const { theme } = useTheme();
  const navigation = useNavigation()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}

      <LinearGradient
        colors={['#EFBF04', theme.background]}
        style={{
          paddingBottom: 40,
        }}
      >
   <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            // paddingTop: HEIGHT * 0.08
          }}
        >
       
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <VectorIcon
              type="MaterialCommunityIcons"
              name="crown"
              size={48}
              color={theme.text}
            />
          </View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: theme.text,
              marginTop: 20,
            }}
          >
            Premium
          </Text>

          <Text
            style={{
              color: '#fff',
              opacity: 0.9,
              textAlign: 'center',
              marginTop: 10,
              fontSize: 16,
            }}
          >
            Unlock exclusive features and
            elevate your experience.
          </Text>
        </View>
      </LinearGradient>

      {/* Pricing Card */}

      <View
        style={{
          marginHorizontal: 20,
          marginTop: -25,
          backgroundColor: theme.card,
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text
          style={{
            color: theme.textMuted,
            textAlign: 'center',
          }}
        >
          Monthly Plan
        </Text>

        <Text
          style={{
            color: theme.text,
            fontSize: 42,
            fontWeight: '800',
            textAlign: 'center',
            marginTop: 6,
          }}
        >
          ₹299
        </Text>

        <Text
          style={{
            color: theme.textMuted,
            textAlign: 'center',
          }}
        >
          per month
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#F5C518',
            height: 54,
            borderRadius: 27,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: '#000',
            }}
          >
            Start Free Trial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Benefits */}

      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 32,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 20,
          }}
        >
          What's Included
        </Text>

        {benefits.map(item => (
          <View
            key={item}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#F5C518',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VectorIcon
                type="Feather"
                name="check"
                size={16}
                color="#000"
              />
            </View>

            <Text
              style={{
                color: theme.text,
                marginLeft: 14,
                fontSize: 15,
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* Comparison */}

      <View
        style={{
          margin: 20,
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: '700',
          }}
        >
          Why Upgrade?
        </Text>

        <Text
          style={{
            color: theme.textMuted,
            marginTop: 10,
            lineHeight: 22,
          }}
        >
          Get more visibility, more engagement,
          premium tools and an ad-free experience
          designed for power users.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  backBtn: {
    padding: 8,
       paddingTop: HEIGHT * 0.08
  },
})