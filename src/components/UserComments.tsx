import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
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
  Link,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import commentService from '../services/comment.service';
import { Link as RouterLink } from 'react-router-dom';

interface Comment {
  id: number;
  content: string;
  game_slug: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
}

const UserComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const limit = 10;

  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getMyComments(limit, offset);
      setComments(data.comments);
      setTotal(data.total);
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
  }, [offset]);

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

  const formatGameName = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading && comments.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="purple.500" />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">У вас пока нет комментариев</Text>
        <Button as={RouterLink} to="/" colorScheme="purple" size="sm" mt={4}>
          Написать первый комментарий
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {comments.map((comment) => (
          <Card key={comment.id} variant="outline" borderRadius="lg">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                {/* Заголовок с информацией об игре */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Link
                    as={RouterLink}
                    to={`/games/${comment.game_slug}`}
                    _hover={{ textDecoration: 'none' }}>
                    <Badge
                      colorScheme="purple"
                      fontSize="sm"
                      p={2}
                      borderRadius="full"
                      cursor="pointer"
                      _hover={{ bg: 'purple.600', color: 'white' }}>
                      🎮 {formatGameName(comment.game_slug)} <ExternalLinkIcon ml={1} boxSize={3} />
                    </Badge>
                  </Link>

                  <Text fontSize="xs" color="gray.500">
                    {formatDate(comment.created_at)}
                    {comment.created_at !== comment.updated_at && ' (изменено)'}
                  </Text>
                </Flex>

                {/* Текст комментария */}
                {editingId === comment.id ? (
                  <Box>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                      }}
                      rows={3}
                    />
                    <HStack spacing={2} mt={2}>
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

                {/* Кнопки действий */}
                {!editingId && (
                  <HStack spacing={2} justify="flex-end">
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
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Пагинация */}
      {total > limit && (
        <HStack justify="center" spacing={4} mt={6}>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            isDisabled={offset === 0}>
            ← Назад
          </Button>
          <Text fontSize="sm">
            {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
          </Text>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => prev + limit)}
            isDisabled={offset + limit >= total}>
            Вперед →
          </Button>
        </HStack>
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

export default UserComments;
