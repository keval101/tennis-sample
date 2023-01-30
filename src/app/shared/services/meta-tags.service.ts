import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  constructor(private readonly meta: Meta, private readonly title: Title) {}

  updateTheMetaTags(metaTag: any): void {
    this.title.setTitle(metaTag.title);
    this.meta.updateTag(
      { name: 'title', content: metaTag.title },
      "name='title'"
    );
    this.meta.updateTag(
      { name: 'description', content: metaTag.description },
      "name='description'"
    );
    this.meta.updateTag(
      { name: 'keywords', content: metaTag.keywords },
      "name='keywords'"
    );
  }
}
