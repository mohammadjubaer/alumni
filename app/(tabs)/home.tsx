import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PostCard } from "@/components/post-card";
import { Post, dataService } from "@/lib/data-service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "job" | "advice">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedFilter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await dataService.getPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((p) => p.type === selectedFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.authorName.toLowerCase().includes(query),
      );
    }

    setFilteredPosts(filtered);
  };

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      await dataService.updatePost(postId, { likes: post.likes + 1 });
      loadPosts();
    }
  };

  const handleSave = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      await dataService.updatePost(postId, { saves: post.saves + 1 });
      loadPosts();
    }
  };

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => handleLike(item.id)}
            onSave={() => handleSave(item.id)}
          />
        )}
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-2">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-foreground">
                Alumni Feed
              </Text>
              <Text className="text-sm text-muted mt-1">
                Discover opportunities and insights
              </Text>
            </View>

            {/* Search Bar */}
            <View className="mb-4">
              <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
                <MaterialIcons name="search" size={20} color={colors.muted} />
                <TextInput
                  placeholder="Search posts..."
                  placeholderTextColor={colors.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 ml-2 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>
            </View>

            {/* Filter Tabs */}
            <View className="flex-row gap-2 mb-4">
              {(["all", "job", "advice"] as const).map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    className={`px-4 py-2 rounded-full ${
                      selectedFilter === filter
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold capitalize ${
                        selectedFilter === filter
                          ? "text-background"
                          : "text-foreground"
                      }`}
                    >
                      {filter === "all" ? "All Posts" : filter}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <MaterialIcons name="inbox" size={48} color={colors.muted} />
            <Text className="text-lg font-semibold text-foreground mt-4">
              No posts yet
            </Text>
            <Text className="text-sm text-muted text-center mt-2">
              Check back later for new opportunities and advice from alumni
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEventThrottle={16}
      />
    </ScreenContainer>
  );
}
