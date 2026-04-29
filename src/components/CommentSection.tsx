import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Textarea,
  Button,
  useToast,
  Spinner,
  Divider,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import commentService from '../services/comment.service';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Comment {
  id: number;
  content: string;
  game_slug: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  created_at: string;
  updated_at: string;
}

interface CommentSectionProps {
  gameSlug: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ gameSlug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Загрузка комментариев
  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByGame(gameSlug);
      setComments(data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить комментарии',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [gameSlug]);

  // Отправка комментария
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт чтобы оставить комментарий',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Пустой комментарий',
        description: 'Напишите что-нибудь перед отправкой',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    try {
      setSubmitting(true);
      await commentService.createComment(newComment, gameSlug);
      setNewComment('');
      toast({
        title: 'Комментарий отправлен',
        status: 'success',
        duration: 2000,
      });
      loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить комментарий',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Редактирование комментария
  const handleEdit = async (id: number) => {
    if (!editContent.trim()) return;

    try {
      await commentService.updateComment(id, editContent);
      setEditingId(null);
      setEditContent('');
      toast({
        title: 'Комментарий обновлен',
        status: 'success',
        duration: 2000,
      });
      loadComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить комментарий',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Удаление комментария
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await commentService.deleteComment(deleteId);
      toast({
        title: 'Комментарий удален',
        status: 'success',
        duration: 2000,
      });
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить комментарий',
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ru });
  };

  return (
    <Box mt={8}>
      <Divider my={6} />

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        💬 Комментарии ({comments.length})
      </Text>

      {/* Форма добавления комментария */}
      <Box mb={6}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            user ? 'Напишите ваш комментарий...' : 'Войдите в аккаунт чтобы оставить комментарий'
          }
          rows={3}
          isDisabled={!user}
        />
        <Button
          mt={2}
          colorScheme="purple"
          onClick={handleSubmit}
          isLoading={submitting}
          isDisabled={!user || !newComment.trim()}>
          Отправить
        </Button>
      </Box>

      {/* Список комментариев */}
      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={8}>
          Пока нет комментариев. Будьте первым!
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {comments.map((comment) => (
            <Box key={comment.id} p={4} bg="gray.50" borderRadius="lg">
              <HStack spacing={3} mb={2}>
                <Avatar
                  size="sm"
                  name={comment.user_name}
                  src={
                    comment.user_avatar ? `http://localhost:7000${comment.user_avatar}` : undefined
                  }
                />
                <Box flex={1}>
                  <Link to={`/profile/${comment.user_id}`}>
                    <Text fontWeight="bold" _hover={{ color: 'purple.500' }}>
                      {comment.user_name}
                    </Text>
                  </Link>
                  <Text fontSize="xs" color="gray.500">
                    {formatDate(comment.created_at)}
                    {comment.created_at !== comment.updated_at && ' (изменено)'}
                  </Text>
                </Box>
                {user && user.id === comment.user_id && (
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteId(comment.id);
                        onOpen();
                      }}
                    />
                  </HStack>
                )}
              </HStack>

              {editingId === comment.id ? (
                <Box>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    mb={2}
                  />
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="purple" onClick={() => handleEdit(comment.id)}>
                      Сохранить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Отмена
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Text>{comment.content}</Text>
              )}
            </Box>
          ))}
        </VStack>
      )}

      {/* Диалог удаления */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Удалить комментарий?
            </AlertDialogHeader>
            <AlertDialogBody>Вы уверены? Это действие нельзя отменить.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отмена
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CommentSection;
