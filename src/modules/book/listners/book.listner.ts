import { OnEvent } from '@nestjs/event-emitter';
import { BookDispatchedEvent } from '../events/book-dispatched.event';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BookListner {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @OnEvent('book.created', { async: true })
  async handleBookCreated(event: BookDispatchedEvent) {
    // clear get all books cache

    // cache keys is dynamically changed based on query pagination ex
    // [ '/book?page=2&limit=10', '/book?page=1&limit=10' ]
    // so i could not set a static cache key like ('books') to getall endpoint , so i'll leave it dynamic

    const booksKeys = (await this.cacheManager.store.keys()).filter(
      // the ends with /books? is getall with pagination , the ends with /books is getall without pagination
      (url) => url.includes('/book?') || url.endsWith('/book'),
    );
    // delete all keys in parallel
    const promises = booksKeys.map((key) => this.cacheManager.del(key));
    await Promise.all(promises);

    // ToDo
    // notify users about new book
  }

  @OnEvent('book.updated', { async: true })
  async handleBookUpdated(event: BookDispatchedEvent) {
    const key = await this.cacheManager.del('/books/' + event.id);
  }

  @OnEvent('book.deleted', { async: true })
  async handleBookDeleted(event: BookDispatchedEvent) {
    const key = await this.cacheManager.del('/books/' + event.id);
  }
}
