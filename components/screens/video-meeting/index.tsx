import { Ionicons } from '@expo/vector-icons';
import {
  LiveKitRoom,
  VideoTrack,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
} from '@livekit/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { RoomEvent, Track } from 'livekit-client';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- CHAT MODAL ---
const ChatModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const onDataReceived = (payload: Uint8Array, participant?: any) => {
      const decoder = new TextDecoder();
      const text = decoder.decode(payload);
      setMessages(prev => [...prev, {
        sender: participant?.name || participant?.identity || 'Guest',
        text
      }]);
    };
    room.on(RoomEvent.DataReceived, onDataReceived);
    return () => { room.off(RoomEvent.DataReceived, onDataReceived); };
  }, [room]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const encoder = new TextEncoder();
    await localParticipant.publishData(encoder.encode(inputText), { reliable: true });
    setMessages(prev => [...prev, { sender: 'You', text: inputText }]);
    setInputText('');
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-[#1A1A1A] h-[70%] rounded-t-[35px] p-6 border-t border-white/10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">In-call messages</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="white" /></TouchableOpacity>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className={`mb-3 p-3 rounded-2xl max-w-[80%] ${item.sender === 'You' ? 'bg-purple-600 self-end' : 'bg-white/10 self-start'}`}>
                <Text className="text-white/50 text-[10px] mb-1 font-bold">{item.sender}</Text>
                <Text className="text-white">{item.text}</Text>
              </View>
            )}
          />
          <View className="flex-row items-center mt-4 bg-white/10 rounded-full px-4 py-1">
            <TextInput
              className="flex-1 text-white h-12"
              placeholder="Send message..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={sendMessage}><Ionicons name="send" size={24} color="#8862F2" /></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- PARTICIPANTS MODAL ---
const ParticipantsModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const participants = useParticipants();
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View className="flex-1 bg-black/80 justify-center p-8">
        <View className="bg-[#2A2A2A] rounded-[30px] p-6 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white font-bold text-lg">People ({participants.length})</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="white" /></TouchableOpacity>
          </View>
          <FlatList
            data={participants}
            keyExtractor={(p) => p.identity}
            renderItem={({ item: p }) => (
              <View className="flex-row items-center justify-between mb-4 bg-white/5 p-3 rounded-2xl">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">{p.name?.charAt(0) || '?'}</Text>
                  </View>
                  <Text className="text-white font-medium">{p.name || p.identity.charAt(5)}</Text>
                </View>
                <View className="flex-row space-x-2">
                  <Ionicons name={p.isMicrophoneEnabled ? "mic" : "mic-off"} size={18} color={p.isMicrophoneEnabled ? "#4ade80" : "#ef4444"} />
                  <Ionicons name={p.isCameraEnabled ? "videocam" : "videocam-off"} size={18} color={p.isCameraEnabled ? "#4ade80" : "#ef4444"} />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

// --- VIDEO GRID CONTENT ---
const VideoMeetingContent = () => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ], { onlySubscribed: true });

  return (
    <View className="flex-1 px-4 py-2">
      <FlatList
        data={tracks}
        numColumns={2}
        keyExtractor={(t) => `${t.participant.identity}_${t.source}`}
        renderItem={({ item: track }) => {
          const isRealTrack = 'publication' in track && track.publication !== undefined;
          return (
            <View style={{ width: '48%', height: 180, margin: '1%', borderRadius: 24, overflow: 'hidden', backgroundColor: '#2A2A2A' }}>
              {isRealTrack ? (
                <VideoTrack mirror={true} trackRef={track as any} style={{ flex: 1 }} />
              ) : (
                <View className="flex-1 items-center justify-center bg-gray-800">
                  <Ionicons name="person" size={40} color="white" opacity={0.3} />
                  <Text className="text-white/30 text-[10px] mt-2">Camera Off</Text>
                </View>
              )}
              <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-lg">
                <Text className="text-white text-[10px]" numberOfLines={1}>
                  {track.participant.name || track.participant.identity.slice(0, 8)}
                  {track.participant.isLocal ? ' (You)' : ''}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

// --- INNER CONTENT ---
const VideoMeetingInner = ({ roomName }: { roomName: string }) => {
  const { localParticipant } = useLocalParticipant();
  const [isChatVisible, setChatVisible] = useState(false);
  const [isUsersVisible, setUsersVisible] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const toggleMic = async () => {
    const enabled = !micEnabled;
    await localParticipant.setMicrophoneEnabled(enabled);
    setMicEnabled(enabled);
  };

  const toggleCam = async () => {
    const enabled = !camEnabled;
    await localParticipant.setCameraEnabled(enabled);
    setCamEnabled(enabled);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="bg-white/10 px-4 py-2 rounded-2xl flex-row items-center border border-white/5">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          <Text className="text-white font-semibold text-[12px]">{localParticipant.metadata || roomName}</Text>
        </View>
        <TouchableOpacity className="bg-white/10 p-3 rounded-2xl" onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <VideoMeetingContent />

      {/* Bottom Controls */}
      <View className="bg-[#2A2A2A] mx-6 mb-8 p-4 rounded-[35px] flex-row justify-between items-center border border-white/5 shadow-2xl">
        <TouchableOpacity onPress={toggleMic} className={`w-12 h-12 rounded-full items-center justify-center ${micEnabled ? 'bg-white/10' : 'bg-red-500/20'}`}>
          <Ionicons name={micEnabled ? "mic-outline" : "mic-off-outline"} size={22} color={micEnabled ? "white" : "#ef4444"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCam} className={`w-12 h-12 rounded-full items-center justify-center ${camEnabled ? 'bg-white/10' : 'bg-red-500/20'}`}>
          <Ionicons name={camEnabled ? "videocam-outline" : "videocam-off-outline"} size={22} color={camEnabled ? "white" : "#ef4444"} />
        </TouchableOpacity>

        <TouchableOpacity className="w-16 h-16 bg-red-500 rounded-full items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="call" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setChatVisible(true)} className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="chatbubble-outline" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setUsersVisible(true)} className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
          <Ionicons name="people-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ChatModal isVisible={isChatVisible} onClose={() => setChatVisible(false)} />
      <ParticipantsModal isVisible={isUsersVisible} onClose={() => setUsersVisible(false)} />
    </SafeAreaView>
  );
};

// --- MAIN EXPORT ---
const VideoMeeting = () => {
  const params = useLocalSearchParams<{ token: string; url: string; roomName: string }>();

  if (!params.token || !params.url) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Connection error...</Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={params.url}
      token={params.token}
      connect={true}
      audio={true}
      video={true}
      onDisconnected={() => router.back()}
      onError={(error) => console.error("LiveKit Error:", error)}
    >
      <VideoMeetingInner roomName={params.roomName || 'Meeting'} />
    </LiveKitRoom>
  );
};

export default VideoMeeting;