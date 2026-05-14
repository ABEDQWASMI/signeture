import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing } from '../constants/theme';
import { CHAT_MESSAGES } from '../constants/data';

const QUICK_REPLIES = [
  'تتبع طلبي',
  'إلغاء الطلب',
  'مشكلة في الدفع',
  'سؤال عن القائمة',
  'ملاحظات',
];

export function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const send = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: `u${Date.now()}`, sender: 'user', text, time };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // Bot reply
    setTimeout(() => {
      const botMsg = {
        id: `b${Date.now()}`,
        sender: 'bot',
        text: getBotReply(text),
        time,
      };
      setMessages((m) => [...m, botMsg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800);
  };

  const getBotReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes('تتبع') || t.includes('طلب') || t.includes('track')) return 'يمكنني مساعدتك! آخر طلباتك ORD-8821 تم تسليمه. هل ثمة شيء آخر يمكنني مساعدتك به؟';
    if (t.includes('إلغاء') || t.includes('cancel')) return 'لإلغاء طلب، يجب أن يكون خلال دقيقتين من تقديمه. اضغط على إلغاء في سجل طلباتك.';
    if (t.includes('دفع') || t.includes('billing')) return 'يمكنني رؤية سجل مدفوعاتك. كل المبالغ تبدو صحيحة. هل ثمة مبلغ غير صحيح؟';
    if (t.includes('قائمة') || t.includes('menu')) return 'قائمتنا الكاملة متاحة في تبويب القائمة! هل تحتاج توصية؟';
    return 'شكراً لتواصلك! سيقوم أحد أعضاء فريقنا بالمتابعة خلال 30 دقيقة. هل ثمة شيء آخر؟';
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Feather name="arrow-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.agentInfo}>
            <View style={styles.agentAvatar}>
              <Feather name="coffee" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.agentName}>دعم Signature</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>متاح · يرد عادةً خلال دقائق</Text>
              </View>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[
                styles.messageRow,
                item.sender === 'user' && styles.messageRowUser,
              ]}>
                {item.sender === 'bot' && (
                  <View style={styles.botAvatar}>
                    <Text style={styles.botAvatarText}>S</Text>
                  </View>
                )}
                <View style={[
                  styles.bubble,
                  item.sender === 'user' ? styles.bubbleUser : styles.bubbleBot,
                ]}>
                  <Text style={[
                    styles.bubbleText,
                    item.sender === 'user' && styles.bubbleTextUser,
                  ]}>
                    {item.text}
                  </Text>
                  <Text style={styles.bubbleTime}>{item.time}</Text>
                </View>
              </View>
            )}
          />

          {/* Quick replies */}
          <FlatList
            data={QUICK_REPLIES}
            keyExtractor={(q) => q}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() => send(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <View style={styles.inputOuter}>
              <View style={styles.inputInner}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="اكتب رسالة..."
                  placeholderTextColor={Colors.textSubtle}
                  style={styles.textInput}
                  textAlign="right"
                  multiline
                  maxLength={500}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={() => send(input)}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Feather name="send" size={18} color={Colors.background} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  back: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.cardBg, borderWidth: 1,
    borderColor: Colors.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: Colors.secondary, fontSize: 18 },
  agentInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  agentAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  agentEmoji: { fontSize: 20 },
  agentName: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  onlineText: { color: Colors.textMuted, fontSize: Typography.xs },
  messageList: { padding: Spacing.lg, gap: 14, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  messageRowUser: { flexDirection: 'row-reverse' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  botAvatarText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.bold },
  bubble: {
    maxWidth: '75%', borderRadius: Radii.xl, padding: 12,
    paddingHorizontal: 14,
  },
  bubbleBot: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { color: Colors.secondary, fontSize: Typography.base, lineHeight: 22 },
  bubbleTextUser: { color: Colors.background },
  bubbleTime: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs, marginTop: 4, textAlign: 'right' },
  quickList: { paddingHorizontal: Spacing.lg, paddingVertical: 8, gap: 8 },
  quickChip: {
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  quickChipText: { color: Colors.primary, fontSize: Typography.xs, fontWeight: Typography.medium },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.cardBorder,
  },
  inputOuter: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', padding: 2,
  },
  inputInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  textInput: {
    color: Colors.secondary, fontSize: Typography.base,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.cardBg },
  sendBtnText: { color: Colors.background, fontSize: 20, fontWeight: Typography.bold },
});
