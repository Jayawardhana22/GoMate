import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  Platform, // <--- Added Platform import
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Icon from '../components/Icon';

import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/themeSlice';
import { colors } from '../utils/colors';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  const { favorites } = useSelector((state) => state.transport);

  const [profileImage, setProfileImage] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('userProfileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log('Error loading image', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      setProfileImage(newImageUri);
      await AsyncStorage.setItem('userProfileImage', newImageUri);
    }
  };

  // --- FIXED LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Check if we are on the Web
    if (Platform.OS === 'web') {
      // Use browser standard confirm box
      if (window.confirm('Are you sure you want to logout?')) {
        setProfileImage(null);
        dispatch(logout());
      }
    } else {
      // 2. Use Native Alert for Mobile
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              setProfileImage(null);
              dispatch(logout());
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const SettingItem = ({ icon, title, value, onPress, showSwitch, switchValue, onSwitchChange }) => (
    <TouchableOpacity
      style={[styles.settingItem, isDarkMode && styles.settingItemDark]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
          <Icon name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, isDarkMode && styles.textDark]}>
            {title}
          </Text>
          {value && !showSwitch && (
            <Text style={[styles.settingValue, isDarkMode && styles.textLight]}>
              {value}
            </Text>
          )}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.textLight, true: colors.primary }}
          thumbColor={colors.white}
        />
      ) : (
        <Icon name="chevron-right" size={20} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View style={styles.avatar}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </Text>
                )}
                <View style={styles.editIconBadge}>
                   <Icon name="camera" size={14} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.editHint}>Tap to change photo</Text>
          </View>
          
          <Text style={styles.name}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </Text>
          <Text style={styles.email}>{user?.email || 'user@gomate.com'}</Text>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
            <Icon name="heart" size={24} color={colors.error} />
            <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>
              {favorites.length}
            </Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textLight]}>
              Favorites
            </Text>
          </View>

          <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
            <Icon name="clock" size={24} color={colors.success} />
            <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>24/7</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.textLight]}>
              Live Updates
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
            Preferences
          </Text>

          <SettingItem
            icon="moon"
            title="Dark Mode"
            showSwitch
            switchValue={isDarkMode}
            onSwitchChange={() => dispatch(toggleTheme())}
          />

          <SettingItem
            icon="bell"
            title="Notifications"
            showSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={(val) => setNotificationsEnabled(val)}
          />

          <SettingItem
            icon="map-pin"
            title="Location Services"
            showSwitch
            switchValue={locationEnabled}
            onSwitchChange={(val) => setLocationEnabled(val)}
          />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
            About
          </Text>

          <SettingItem
            icon="info"
            title="App Version"
            value="1.0.0"
            onPress={() => {}}
          />

          <SettingItem
            icon="help-circle"
            title="Help & Support"
            onPress={() => Alert.alert('Support', 'Contact: support@gomate.com')}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDarkMode && styles.textLight]}>
            GoMate v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBg },
  containerDark: { backgroundColor: colors.darkBg },
  header: { padding: 24, paddingTop: 40, paddingBottom: 40, alignItems: 'center' },
  avatarContainer: { marginBottom: 12, alignItems: 'center' },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: colors.white, position: 'relative',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: colors.white },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.white, padding: 6, borderRadius: 20, elevation: 4 },
  editHint: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 8 },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.white, marginBottom: 4 },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, marginTop: -30 },
  statCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 20, marginHorizontal: 8,
    alignItems: 'center', elevation: 3, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  statCardDark: { backgroundColor: colors.darkCard, borderColor: colors.darkBorder, borderWidth: 1 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginLeft: 4 },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white,
    borderRadius: 12, padding: 16, marginBottom: 8, elevation: 1, shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  settingItemDark: { backgroundColor: colors.darkCard, borderColor: colors.darkBorder, borderWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  settingValue: { fontSize: 13, color: colors.textSecondary },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.error}10`,
    borderWidth: 1, borderColor: colors.error, borderRadius: 12, padding: 16, margin: 16,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error, marginLeft: 8 },
  footer: { alignItems: 'center', padding: 24 },
  footerText: { fontSize: 12, color: colors.textLight, marginBottom: 4 },
  textDark: { color: colors.textDark },
  textLight: { color: colors.textLight },
});