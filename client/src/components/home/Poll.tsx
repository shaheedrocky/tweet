import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import { Poll as PollType } from '../../types';

interface PollProps {
  tweetId: string;
  poll: PollType;
}

const Poll: React.FC<PollProps> = ({ tweetId, poll }) => {
  const { theme } = useTheme();
  const { user, voteInPoll } = useApp();

  const totalVotes = poll.totalVotes || 1; // avoid division by 0

  // Check if current user has voted in this poll
  const hasVoted = React.useMemo(() => {
    if (!user) return false;
    return poll.options.some(opt => opt.voters.includes(user.id) || opt.voters.includes('current_user'));
  }, [poll.options, user]);

  const getVotedOptionIndex = React.useMemo(() => {
    if (!user) return -1;
    return poll.options.findIndex(opt => opt.voters.includes(user.id) || opt.voters.includes('current_user'));
  }, [poll.options, user]);

  const handleVote = (index: number) => {
    if (!hasVoted) {
      voteInPoll(tweetId, index);
    }
  };

  return (
    <View style={styles.container}>
      {poll.options.map((option, index) => {
        const percentage = Math.round((option.votes / totalVotes) * 100);
        const isUserVoted = index === getVotedOptionIndex;

        if (hasVoted) {
          // Render progress bar mode
          return (
            <View key={index} style={styles.votedContainer}>
              {/* Animated Progress Bar */}
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${percentage}%`,
                    backgroundColor: isUserVoted ? `${theme.primary}25` : theme.border,
                  },
                ]}
              />

              {/* Info Row overlay */}
              <View style={styles.textOverlay}>
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: theme.text,
                      fontWeight: isUserVoted ? '700' : '400',
                    },
                  ]}
                >
                  {option.text} {isUserVoted ? '✓' : ''}
                </Text>
                <Text
                  style={[
                    styles.percentageText,
                    {
                      color: theme.text,
                      fontWeight: isUserVoted ? '700' : '500',
                    },
                  ]}
                >
                  {percentage}%
                </Text>
              </View>
            </View>
          );
        }

        // Render clickable options mode
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleVote(index)}
            style={[
              styles.voteBtn,
              { borderColor: theme.primary, backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.voteBtnText, { color: theme.primary }]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Footer Meta */}
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>
          {poll.totalVotes} votes · Final results
        </Text>
      </View>
    </View>
  );
};

export default Poll;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
  },
  votedContainer: {
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  textOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
  },
  percentageText: {
    fontSize: 14,
  },
  voteBtn: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  voteBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
  },
});
